import { useState, useEffect } from 'react'
import URLInput from '../home/URLInput'
import URLHistory from '../home/URLHistory'
import VideoInfoCard from '../home/VideoInfoCard'
import FormatSelection from '../home/FormatSelection'
import QualitySelection from '../home/QualitySelection'
import DownloadButton from '../home/DownloadButton'
import DownloadProgress from '../home/DownloadProgress'
import DownloadComplete from '../home/DownloadComplete'

export default function HomePage({
  url, setUrl,
  videoInfo, setVideoInfo,
  format, setFormat,
  quality, setQuality,
  loading, downloading,
  error, setError,
  currentDownload,
  downloadComplete,
  onAnalyze, onDownload, onReset
}) {
  const [urlHistory, setUrlHistory] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('yt-downloader-url-history')
    if (stored) {
      try {
        setUrlHistory(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing URL history:', e)
      }
    }
  }, [])

  const addToUrlHistory = (newUrl) => {
    const updated = [newUrl, ...urlHistory.filter(u => u !== newUrl)].slice(0, 20)
    setUrlHistory(updated)
    localStorage.setItem('yt-downloader-url-history', JSON.stringify(updated))
  }

  const clearUrlHistory = () => {
    setUrlHistory([])
    localStorage.removeItem('yt-downloader-url-history')
  }

  const removeFromUrlHistory = (urlToRemove) => {
    const updated = urlHistory.filter(u => u !== urlToRemove)
    setUrlHistory(updated)
    localStorage.setItem('yt-downloader-url-history', JSON.stringify(updated))
  }

  const handleAnalyzeWithHistory = () => {
    if (!url.trim()) return
    addToUrlHistory(url)
    onAnalyze()
  }

  const handleSelectFromHistory = (selectedUrl) => {
    setUrl(selectedUrl)
  }

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-sm sm:text-lg lg:text-xl" style={{ color: 'var(--text-secondary)' }}>
          Download your favorite videos and music in MP3 or MP4
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <URLInput
          url={url}
          onChange={setUrl}
          onAnalyze={handleAnalyzeWithHistory}
          loading={loading}
        />
        <URLHistory
          urls={urlHistory}
          onSelect={handleSelectFromHistory}
          onClear={clearUrlHistory}
          onRemove={removeFromUrlHistory}
        />
      </div>

      {error && (
        <div className="glass p-3 sm:p-4 mb-4 sm:mb-6 border-red-500/30 bg-red-500/10 animate-fadeIn">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">⚠️</span>
            <div className="flex-1 min-w-0">
              <p className="text-red-400 text-xs sm:text-sm font-medium">Error</p>
              <p className="text-red-300 text-[10px] sm:text-xs truncate">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 flex-shrink-0">✕</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Analyzing video...</p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>Fetching video information</p>
            </div>
          </div>
        </div>
      )}

      {downloading && !currentDownload && (
        <div className="flex items-center justify-center py-10 sm:py-16">
          <div className="text-center space-y-3 sm:space-y-4 animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-red-500/20 flex items-center justify-center glow-red">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Preparing Download...</p>
              <p className="text-xs sm:text-sm mt-1 truncate px-4" style={{ color: 'var(--text-muted)' }}>{videoInfo?.title || 'Fetching video data'}</p>
            </div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {currentDownload && (
        <div className="mb-4 sm:mb-6">
          <DownloadProgress download={currentDownload} onCancel={onReset} />
        </div>
      )}

      {downloadComplete && (
        <div className="mb-4 sm:mb-6">
          <DownloadComplete download={downloadComplete} onReset={onReset} />
        </div>
      )}

      {videoInfo && !currentDownload && !downloadComplete && !downloading && (
        <div className="space-y-4 sm:space-y-6 animate-fadeIn">
          <VideoInfoCard info={videoInfo} />
          <FormatSelection selectedFormat={format} onSelect={setFormat} />
          {format === 'mp4' && videoInfo.formats && (
            <QualitySelection formats={videoInfo.formats} selectedQuality={quality} onSelect={setQuality} />
          )}
          <DownloadButton onClick={onDownload} />
        </div>
      )}
    </div>
  )
}