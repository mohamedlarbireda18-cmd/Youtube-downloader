const express = require('express');
const router = express.Router();
const db = require('../database/init');

// GET /stats
router.get('/', (req, res) => {
  try {
    const currentMonth = new Date();
    const monthYear = `${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${currentMonth.getFullYear()}`;
    
    // Récupérer ou créer les stats du mois
    let stats = db.prepare('SELECT * FROM stats WHERE month_year = ?').get(monthYear);
    
    if (!stats) {
      db.prepare('INSERT INTO stats (total_downloads, total_data_bytes, monthly_downloads, month_year) VALUES (0, 0, 0, ?)').run(monthYear);
      stats = db.prepare('SELECT * FROM stats WHERE month_year = ?').get(monthYear);
    }

    // Total global (somme de tous les mois)
    const totalAllTime = db.prepare('SELECT SUM(total_downloads) as total, SUM(total_data_bytes) as data FROM stats').get();

    res.json({
      monthlyDownloads: stats.monthly_downloads || 0,
      totalDownloads: totalAllTime.total || 0,
      totalDataBytes: totalAllTime.data || 0,
      dataDownloaded: formatBytes(totalAllTime.data || 0),
      averageSpeed: '0 MB/s',
      successRate: calculateSuccessRate(),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function calculateSuccessRate() {
  const total = db.prepare('SELECT COUNT(*) as count FROM history').get();
  const completed = db.prepare("SELECT COUNT(*) as count FROM history WHERE status = 'completed'").get();
  
  if (total.count === 0) return '100%';
  return `${Math.round((completed.count / total.count) * 100)}%`;
}

module.exports = router;