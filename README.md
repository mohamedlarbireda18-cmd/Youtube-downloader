# YT Downloader

Application full stack de téléchargement YouTube permettant d'extraire l'audio (MP3) ou la vidéo (MP4) avec choix de qualité, progression en temps réel et historique.

## Fonctionnalités

- 🎵 Téléchargement MP3
- 🎬 Téléchargement MP4 (360p → 4K)
- 📊 Progression en temps réel (Socket.io)
- ⏸️ Pause / Reprise / Annulation
- 📜 Historique des téléchargements (SQLite)
- 📈 Analytics (stats mensuelles)
- 🌙 Dark / Light mode
- 📱 Responsive design (mobile + desktop)
- 🧹 Nettoyage automatique des fichiers

## Stack technique

- **Frontend** : React, Vite, Tailwind CSS, Axios, Socket.io Client
- **Backend** : Node.js, Express, Socket.io, better-sqlite3
- **Outils** : yt-dlp, FFmpeg

## Installation

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/youtube-downloader.git
cd youtube-downloader

# Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# Installer yt-dlp et FFmpeg
# Windows : choco install yt-dlp ffmpeg
# Mac : brew install yt-dlp ffmpeg
# Linux : sudo apt install yt-dlp ffmpeg

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev -- --host 0.0.0.0

youtube-downloader/
├── frontend/          # React + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── backend/           # Express + Socket.io
│   ├── routes/
│   ├── services/
│   └── index.js
├── downloads/         # Fichiers téléchargés
└── database/          # SQLite


Puis :

```powershell
git add README.md
git commit -m "Ajout du README"
git push