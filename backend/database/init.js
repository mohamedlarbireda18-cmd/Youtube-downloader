const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'database', 'downloads.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    format TEXT NOT NULL,
    quality TEXT,
    file_path TEXT,
    file_size TEXT,
    thumbnail TEXT,
    duration TEXT,
    channel TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_downloads INTEGER DEFAULT 0,
    total_data_bytes INTEGER DEFAULT 0,
    monthly_downloads INTEGER DEFAULT 0,
    month_year TEXT UNIQUE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('download_path', 'downloads');
  
  -- Initialiser les stats du mois courant si pas déjà fait
  INSERT OR IGNORE INTO stats (total_downloads, total_data_bytes, monthly_downloads, month_year)
  VALUES (0, 0, 0, strftime('%m-%Y', 'now'));
`);

module.exports = db;