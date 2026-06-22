const express = require('express');
const router = express.Router();
const ytdlp = require('../services/ytdlp');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const path = require('path');
const fs = require('fs');

module.exports = function(io, downloadManager) {
  // POST /video-info
  router.post('/video-info', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const videoInfo = await ytdlp.getVideoInfo(url);
      res.json(videoInfo);
    } catch (error) {
      console.error('Error fetching video info:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /download
  router.post('/download', async (req, res) => {
    try {
      const { url, format, quality } = req.body;
      const jobId = uuidv4();

      const videoInfo = await ytdlp.getVideoInfo(url);
      
      // addToQueue enregistre automatiquement le download actif maintenant
      await downloadManager.addToQueue(jobId, videoInfo, format, quality);

      // Incrémenter les statistiques (ne diminue jamais)
      const currentMonth = new Date();
      const monthYear = `${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${currentMonth.getFullYear()}`;

      // S'assurer que la ligne du mois existe
      db.prepare(`
        INSERT OR IGNORE INTO stats (total_downloads, total_data_bytes, monthly_downloads, month_year)
        VALUES (0, 0, 0, ?)
      `).run(monthYear);

      // Incrémenter
      db.prepare(`
        UPDATE stats 
        SET total_downloads = total_downloads + 1,
            monthly_downloads = monthly_downloads + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE month_year = ?
      `).run(monthYear);

      // Ajouter à l'historique
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO history (video_id, title, url, format, quality, thumbnail, duration, channel, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'downloading')
      `);
      
      stmt.run(
        videoInfo.videoId,
        videoInfo.title,
        videoInfo.url,
        format,
        quality || 'best',
        videoInfo.thumbnail,
        videoInfo.duration,
        videoInfo.channel
      );

      res.json({ 
        jobId, 
        message: 'Download started',
        videoInfo 
      });
    } catch (error) {
      console.error('Error starting download:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /pause/:jobId
  router.post('/pause/:jobId', (req, res) => {
    const { jobId } = req.params;
    downloadManager.pauseDownload(jobId);
    res.json({ message: 'Download paused', jobId });
  });

  // POST /resume/:jobId
  router.post('/resume/:jobId', (req, res) => {
    const { jobId } = req.params;
    downloadManager.resumeDownload(jobId);
    res.json({ message: 'Download resumed', jobId });
  });

  // POST /cancel/:jobId
  router.post('/cancel/:jobId', (req, res) => {
    const { jobId } = req.params;
    downloadManager.cancelDownload(jobId);
    res.json({ message: 'Download cancelled', jobId });
  });

  // HEAD /download-file/:jobId - Vérifier si le fichier existe sans le télécharger
  router.head('/download-file/:jobId', (req, res) => {
    const { jobId } = req.params;
    const completedDownload = downloadManager.completedDownloads.get(jobId);
    
    const downloadsPath = path.join(__dirname, '..', '..', 'downloads');
    
    let filePath;

    if (completedDownload) {
      filePath = completedDownload.filePath;
    } else {
      if (!fs.existsSync(downloadsPath)) {
        return res.status(404).end();
      }
      const files = fs.readdirSync(downloadsPath);
      if (files.length === 0) {
        return res.status(404).end();
      }
      filePath = path.join(downloadsPath, files[files.length - 1]);
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).end();
    }

    const stats = fs.statSync(filePath);
    res.setHeader('Content-Length', stats.size);
    res.status(200).end();
  });

  // GET /download-file/:jobId
  router.get('/download-file/:jobId', (req, res) => {
    const { jobId } = req.params;
    const completedDownload = downloadManager.completedDownloads.get(jobId);
    
    const downloadsPath = path.join(__dirname, '..', '..', 'downloads');
    
    let filePath, fileName;

    if (completedDownload) {
      filePath = completedDownload.filePath;
      fileName = completedDownload.fileName;
    } else {
      if (!fs.existsSync(downloadsPath)) {
        return res.status(404).json({ error: 'No downloads folder found' });
      }
      const files = fs.readdirSync(downloadsPath);
      if (files.length === 0) {
        return res.status(404).json({ error: 'No files found' });
      }
      fileName = files[files.length - 1];
      filePath = path.join(downloadsPath, fileName);
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
    };
    
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Quand l'envoi est terminé, marquer le fichier comme envoyé
    fileStream.on('end', () => {
      downloadManager.markFileAsSent(jobId);
    });

    // En cas d'erreur de stream
    fileStream.on('error', (err) => {
      console.error('Erreur envoi fichier:', err.message);
    });
  });

  return router;
};