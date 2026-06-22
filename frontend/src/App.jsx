import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { API_URL, SOCKET_URL } from './config'
import MainLayout from './components/layout/MainLayout'
import HomePage from './components/pages/HomePage'
import DownloadsPage from './components/pages/DownloadsPage'
import HistoryPage from './components/pages/HistoryPage'
import AnalyticsPage from './components/pages/AnalyticsPage'
import PlaylistsPage from './components/pages/PlaylistsPage'
import SettingsPage from './components/pages/SettingsPage'

const socket = io(SOCKET_URL)

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState('mp4')
  const [quality, setQuality] = useState('1080p')
  const [videoInfo, setVideoInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)
  const [currentDownload, setCurrentDownload] = useState(null)
  const [downloadComplete, setDownloadComplete] = useState(null)
  const [queue, setQueue] = useState([])
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({
    monthlyDownloads: '0',
    totalDownloads: '0',
    dataDownloaded: '0 GB',
    averageSpeed: '0 MB/s',
    successRate: '--',
  })

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', !darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => setDarkMode(!darkMode)

  // Socket listeners
  useEffect(() => {
    socket.on('download:started', (data) => {
      setDownloading(false)
      setCurrentDownload({
        ...data,
        progress: 0,
        speed: '0 MB/s',
        remaining: 'Calculating...',
        downloaded: '0 MB',
        totalSize: 'Calculating...',
      })
      setDownloadComplete(null)
      setError(null)
    })

    socket.on('download:progress', (data) => {
      setCurrentDownload(prev => prev ? {
        ...prev,
        progress: Math.round(data.percent * 10) / 10,
        speed: data.speed,
        remaining: data.eta,
        downloaded: data.downloaded,
        totalSize: data.totalSize || prev.totalSize,
      } : null)
    })

    socket.on('download:completed', (data) => {
      setDownloadComplete(data)
      setCurrentDownload(null)
      setDownloading(false)
      fetchHistory()
      fetchStats()
    })

    socket.on('download:ready-to-save', (data) => {
      console.log('Ready to save:', data.message)
    })

    socket.on('download:paused', (data) => {
      console.log('Download paused:', data.jobId)
    })

    socket.on('download:resumed', (data) => {
      console.log('Download resumed:', data.jobId)
    })

    socket.on('download:cancelled', (data) => {
      setCurrentDownload(null)
      setDownloading(false)
      setDownloadComplete(null)
    })

    socket.on('download:error', (data) => {
      setError(data.error)
      setCurrentDownload(null)
      setDownloadComplete(null)
      setDownloading(false)
    })

    socket.on('queue:updated', (data) => {
      setQueue(data)
    })

    return () => {
      socket.off('download:started')
      socket.off('download:progress')
      socket.off('download:completed')
      socket.off('download:ready-to-save')
      socket.off('download:paused')
      socket.off('download:resumed')
      socket.off('download:cancelled')
      socket.off('download:error')
      socket.off('queue:updated')
    }
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`)
      setHistory(response.data)
    } catch (err) {
      console.error('Error fetching history:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`)
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [])

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(`${API_URL}/history/${id}`)
      fetchHistory()
    } catch (err) {
      console.error('Error deleting history:', err)
    }
  }

  const handleAnalyze = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setVideoInfo(null)
    setDownloadComplete(null)
    setCurrentDownload(null)
    setDownloading(false)

    try {
      const response = await axios.post(`${API_URL}/video-info`, { url })
      setVideoInfo(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch video info')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!videoInfo) return

    setError(null)
    setDownloadComplete(null)
    setDownloading(true)

    try {
      await axios.post(`${API_URL}/download`, {
        url: videoInfo.url,
        format,
        quality: format === 'mp4' ? quality : undefined,
      })
    } catch (err) {
      setDownloading(false)
      setError(err.response?.data?.error || 'Failed to start download')
    }
  }

  const handleReset = () => {
    setVideoInfo(null)
    setCurrentDownload(null)
    setDownloadComplete(null)
    setError(null)
    setUrl('')
    setDownloading(false)
  }

  const homePageProps = {
    url,
    setUrl,
    videoInfo,
    setVideoInfo,
    format,
    setFormat,
    quality,
    setQuality,
    loading,
    downloading,
    error,
    setError,
    currentDownload,
    downloadComplete,
    onAnalyze: handleAnalyze,
    onDownload: handleDownload,
    onReset: handleReset,
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage {...homePageProps} />
      case 'downloads':
        return <DownloadsPage currentDownload={currentDownload} queue={queue} />
      case 'history':
        return <HistoryPage history={history} onDelete={handleDeleteHistory} />
      case 'analytics':
        return <AnalyticsPage stats={stats} history={history} />
      case 'playlists':
        return <PlaylistsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <HomePage {...homePageProps} />
    }
  }

  return (
    <MainLayout
      activePage={activePage}
      onPageChange={setActivePage}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    >
      {renderPage()}
    </MainLayout>
  )
}