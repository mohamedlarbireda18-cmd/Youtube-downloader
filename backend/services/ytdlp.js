const { spawn } = require('child_process');
const path = require('path');

class YtDlpService {
  async getVideoInfo(url) {
    return new Promise((resolve, reject) => {
      const command = `yt-dlp -j "${url}" --no-playlist`;
      
      const { exec } = require('child_process');
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Failed to get video info: ${stderr}`));
          return;
        }

        try {
          const info = JSON.parse(stdout);
          resolve({
            videoId: info.id,
            title: info.title,
            url: info.webpage_url,
            thumbnail: info.thumbnail,
            duration: this.formatDuration(info.duration),
            durationSeconds: info.duration,
            channel: info.uploader,
            channelUrl: info.uploader_url,
            views: this.formatViews(info.view_count),
            formats: this.parseFormats(info.formats),
          });
        } catch (parseError) {
          reject(new Error(`Failed to parse video info: ${parseError.message}`));
        }
      });
    });
  }

  download(url, format, quality, outputPath, jobId, onProgress) {
    return new Promise((resolve, reject) => {
      const outputTemplate = path.join(outputPath, '%(title)s.%(ext)s');
      let args = [];

      if (format === 'mp3') {
        args = [
          '-f', 'bestaudio',
          '--extract-audio',
          '--audio-format', 'mp3',
          '--audio-quality', '0',
          '-o', outputTemplate,
          url,
          '--no-playlist',
          '--newline',
        ];
      } else {
        let formatFlag = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
        if (quality && quality !== 'best') {
          const height = quality.replace('p', '');
          formatFlag = `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${height}][ext=mp4]/best[height<=${height}]`;
        }
        args = [
          '-f', formatFlag,
          '--merge-output-format', 'mp4',
          '-o', outputTemplate,
          url,
          '--no-playlist',
          '--newline',
        ];
      }

      const ytDlpProcess = spawn('yt-dlp', args);

      let lastProgress = null;

      ytDlpProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          const progress = this.parseProgress(line);
          if (progress) {
            lastProgress = progress;
            try {
              onProgress({
                jobId,
                percent: progress.percent,
                speed: progress.speed,
                eta: progress.eta,
                downloaded: progress.downloaded,
                totalSize: progress.totalSize,
              });
            } catch (err) {
              // Si onProgress lance une erreur (ex: CANCELLED), on tue le processus
              if (err.message === 'CANCELLED') {
                ytDlpProcess.kill('SIGTERM');
                reject(new Error('CANCELLED'));
                return;
              }
            }
          }
        }
      });

      ytDlpProcess.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          const progress = this.parseProgress(line);
          if (progress) {
            lastProgress = progress;
            try {
              onProgress({
                jobId,
                percent: progress.percent,
                speed: progress.speed,
                eta: progress.eta,
                downloaded: progress.downloaded,
                totalSize: progress.totalSize,
              });
            } catch (err) {
              if (err.message === 'CANCELLED') {
                ytDlpProcess.kill('SIGTERM');
                reject(new Error('CANCELLED'));
                return;
              }
            }
          }
        }
      });

      ytDlpProcess.on('error', (err) => {
        reject(new Error(`Failed to start yt-dlp: ${err.message}`));
      });

      ytDlpProcess.on('close', (code) => {
        if (code === 0 || code === null) {
          resolve(true);
        } else if (code === 1 && lastProgress) {
          // yt-dlp retourne parfois 1 même si le téléchargement est OK
          resolve(true);
        } else {
          reject(new Error(`Download failed with code ${code}`));
        }
      });
    });
  }

  parseFormats(formats) {
    const videoFormats = [];
    const seen = new Set();

    for (const format of formats) {
      if (format.vcodec !== 'none' && format.height && !seen.has(format.height)) {
        seen.add(format.height);
        videoFormats.push({
          height: format.height,
          quality: `${format.height}p`,
          filesize: format.filesize ? this.formatFileSize(format.filesize) : 'Unknown',
        });
      }
    }

    return videoFormats.sort((a, b) => b.height - a.height);
  }

  parseProgress(line) {
    const percentMatch = line.match(/(\d+\.?\d*)%/);
    const speedMatch = line.match(/(\d+\.?\d*\s*[KMGT]?i?B\/s)/);
    const etaMatch = line.match(/ETA\s+(\d+:?\d*)/);
    const sizeMatch = line.match(/(\d+\.?\d*\s*[KMGT]?i?B)\s+of\s+(\d+\.?\d*\s*[KMGT]?i?B)/);

    if (percentMatch) {
      return {
        percent: parseFloat(percentMatch[1]),
        speed: speedMatch ? speedMatch[1] : 'N/A',
        eta: etaMatch ? etaMatch[1] : 'N/A',
        downloaded: sizeMatch ? sizeMatch[1] : 'N/A',
        totalSize: sizeMatch ? sizeMatch[2] : 'N/A',
      };
    }
    return null;
  }

  formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatViews(views) {
    if (!views) return 'Unknown';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  }

  formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

module.exports = new YtDlpService();