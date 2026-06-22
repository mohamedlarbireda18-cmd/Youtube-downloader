const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const DownloadManager = require('./services/downloader');
const videoRoutes = require('./routes/video');
const historyRoutes = require('./routes/history');
const statsRoutes = require('./routes/stats');

const app = express();
const server = http.createServer(app);

// Configuration CORS pour accepter toutes les origines
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

const downloadManager = new DownloadManager(io);

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Montage des routes vidéo (POST /video-info et POST /download)
app.use(videoRoutes(io, downloadManager));

// Montage des routes historique (GET /history et DELETE /history/:id)
app.use('/history', historyRoutes);

// Montage des routes statistiques (GET /stats)
app.use('/stats', statsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ status: 'YT Downloader API is running' });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Accessible sur le réseau sur http://192.168.1.9:${PORT}`);
});