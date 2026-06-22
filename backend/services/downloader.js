const ytdlp = require('./ytdlp');
const path = require('path');
const fs = require('fs');

// Durée de vie des fichiers : 5 minutes après la fin du téléchargement
const FILE_TTL = 5 * 60 * 1000; // 5 minutes en millisecondes

class DownloadManager {
  constructor(io) {
    this.io = io;
    this.queue = [];
    this.activeDownloads = new Map();
    this.completedDownloads = new Map();
    this.pendingFiles = new Map(); // Fichiers en attente de suppression
    this.isProcessing = false;
    
    // Nettoyer les fichiers orphelins au démarrage
    this.cleanupOrphanFiles();
    
    // Nettoyer périodiquement les fichiers expirés
    setInterval(() => this.cleanupExpiredFiles(), 60 * 1000); // Toutes les minutes
  }

  // Nettoyer les fichiers orphelins au démarrage
  cleanupOrphanFiles() {
    const outputPath = path.join(__dirname, '..', '..', 'downloads');
    if (!fs.existsSync(outputPath)) return;

    try {
      const files = fs.readdirSync(outputPath);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(outputPath, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;

        // Supprimer les fichiers de plus de 10 minutes (fichiers orphelins)
        if (age > 10 * 60 * 1000) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`🧹 Nettoyage automatique : ${deletedCount} fichier(s) supprimé(s)`);
      }
    } catch (err) {
      console.error('Erreur lors du nettoyage :', err.message);
    }
  }

  // Nettoyer les fichiers expirés
  cleanupExpiredFiles() {
    const now = Date.now();
    
    for (const [jobId, fileInfo] of this.pendingFiles) {
      if (now - fileInfo.timestamp > FILE_TTL) {
        this.deleteFile(fileInfo.filePath, jobId, 'expiré');
        this.pendingFiles.delete(jobId);
      }
    }
  }

  // Supprimer un fichier physique
  deleteFile(filePath, jobId, reason = '') {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Fichier supprimé [${reason}] : ${path.basename(filePath)} (job: ${jobId})`);
        return true;
      }
    } catch (err) {
      console.error(`Erreur suppression fichier [${reason}] :`, err.message);
    }
    return false;
  }

  async addToQueue(jobId, videoInfo, format, quality) {
    // Enregistrer automatiquement le téléchargement actif
    this.activeDownloads.set(jobId, {
      paused: false,
      cancelled: false,
      startedAt: new Date(),
    });

    this.queue.push({
      jobId,
      videoInfo,
      format,
      quality,
      status: 'queued',
      addedAt: new Date(),
    });

    this.io.emit('queue:updated', this.getQueue());
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      await this.processDownload(job);
    }

    this.isProcessing = false;
  }

  async processDownload(job) {
    const { jobId, videoInfo, format, quality } = job;
    
    // Vérifier si déjà annulé avant de commencer
    if (this.activeDownloads.get(jobId)?.cancelled) {
      this.io.emit('download:cancelled', { jobId });
      this.activeDownloads.delete(jobId);
      return;
    }

    this.io.emit('download:started', { jobId, videoInfo, format, quality });
    
    const outputPath = path.join(__dirname, '..', '..', 'downloads');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Nettoyer le nom de fichier des caractères invalides
    const sanitizedTitle = videoInfo.title.replace(/[<>:"/\\|?*]/g, '_');
    const safeFilePath = path.join(outputPath, `${sanitizedTitle}.${format === 'mp3' ? 'mp3' : 'mp4'}`);

    try {
      await ytdlp.download(
        videoInfo.url,
        format,
        quality,
        outputPath,
        jobId,
        (progress) => {
          const activeDownload = this.activeDownloads.get(jobId);
          
          // Si annulé, lancer une erreur pour arrêter yt-dlp
          if (activeDownload?.cancelled) {
            throw new Error('CANCELLED');
          }
          
          // Si en pause, ignorer
          if (activeDownload?.paused) {
            return;
          }

          this.io.emit('download:progress', {
            ...progress,
            jobId,
            format,
          });
        }
      );

      // Trouver le fichier téléchargé
      const files = fs.readdirSync(outputPath);
      const downloadedFile = files.find(f => 
        f.includes(sanitizedTitle.substring(0, 30)) || 
        f.endsWith(format === 'mp3' ? '.mp3' : '.mp4')
      ) || files[files.length - 1];
      
      const filePath = path.join(outputPath, downloadedFile);
      const stats = fs.statSync(filePath);
      
      const downloadResult = {
        jobId,
        videoInfo,
        format,
        quality,
        filePath,
        fileName: downloadedFile,
        fileSize: this.formatFileSize(stats.size),
        fileSizeBytes: stats.size,
      };

      this.completedDownloads.set(jobId, downloadResult);

      // Ajouter aux fichiers en attente avec un timestamp
      this.pendingFiles.set(jobId, {
        filePath,
        fileName: downloadedFile,
        timestamp: Date.now(),
      });

      this.io.emit('download:completed', downloadResult);
      
      setTimeout(() => {
        this.io.emit('download:ready-to-save', {
          jobId,
          fileName: downloadedFile,
          fileSize: this.formatFileSize(stats.size),
          message: 'Le téléchargement va débuter sur votre appareil...',
        });
      }, 500);

    } catch (error) {
      if (error.message === 'CANCELLED') {
        // Supprimer le fichier partiel si annulé
        if (fs.existsSync(safeFilePath)) {
          this.deleteFile(safeFilePath, jobId, 'annulation');
        }
        // Chercher d'autres fichiers partiels
        if (fs.existsSync(outputPath)) {
          const files = fs.readdirSync(outputPath);
          for (const file of files) {
            if (file.includes(sanitizedTitle.substring(0, 20)) && (file.endsWith('.part') || file.endsWith('.ytdl'))) {
              this.deleteFile(path.join(outputPath, file), jobId, 'partiel annulation');
            }
          }
        }
        this.io.emit('download:cancelled', { jobId });
      } else {
        console.error('Download error:', error.message);
        this.io.emit('download:error', {
          jobId,
          error: error.message,
        });
      }
    } finally {
      this.activeDownloads.delete(jobId);
    }
  }

  // Marquer un fichier comme envoyé et planifier sa suppression
  markFileAsSent(jobId) {
    const fileInfo = this.pendingFiles.get(jobId);
    if (fileInfo) {
      console.log(`📤 Fichier envoyé au navigateur : ${fileInfo.fileName}`);
      // Supprimer après 30 secondes (laisse le temps au navigateur de finir)
      setTimeout(() => {
        this.deleteFile(fileInfo.filePath, jobId, 'envoyé');
        this.pendingFiles.delete(jobId);
        this.completedDownloads.delete(jobId);
      }, 30 * 1000);
    }
  }

  pauseDownload(jobId) {
    const activeDownload = this.activeDownloads.get(jobId);
    if (activeDownload) {
      activeDownload.paused = true;
      this.io.emit('download:paused', { jobId });
    }
  }

  resumeDownload(jobId) {
    const activeDownload = this.activeDownloads.get(jobId);
    if (activeDownload) {
      activeDownload.paused = false;
      this.io.emit('download:resumed', { jobId });
    }
  }

  cancelDownload(jobId) {
    const activeDownload = this.activeDownloads.get(jobId);
    if (activeDownload) {
      activeDownload.cancelled = true;
    }
    // Retirer de la file d'attente
    this.queue = this.queue.filter(job => job.jobId !== jobId);
    this.io.emit('queue:updated', this.getQueue());
  }

  removeFromQueue(jobId) {
    this.queue = this.queue.filter(job => job.jobId !== jobId);
    this.io.emit('queue:updated', this.getQueue());
  }

  getQueue() {
    return this.queue.map(job => ({
      jobId: job.jobId,
      title: job.videoInfo.title,
      format: job.format,
      quality: job.quality,
      status: job.status,
      thumbnail: job.videoInfo.thumbnail,
    }));
  }

  formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

module.exports = DownloadManager;