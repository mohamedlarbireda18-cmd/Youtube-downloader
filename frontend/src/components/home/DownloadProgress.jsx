import { useState } from 'react'
import { API_URL } from '../../config'
import ProgressBar from '../ui/ProgressBar'
import ConfirmModal from '../ui/ConfirmModal'
import axios from 'axios'

export default function DownloadProgress({ download, onCancel }) {
  const [isPaused, setIsPaused] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  if (!download) return null

  const formatLabel = download.format === 'mp3' ? 'MP3 Audio' : `MP4 ${download.quality || ''}`
  const formatIcon = download.format === 'mp3' ? '🎵' : '🎬'

  const handlePause = async () => {
    try {
      if (isPaused) {
        await axios.post(`${API_URL}/resume/${download.jobId}`)
        setIsPaused(false)
      } else {
        await axios.post(`${API_URL}/pause/${download.jobId}`)
        setIsPaused(true)
      }
    } catch (err) {
      console.error('Error toggling pause:', err)
    }
  }

  const handleCancelConfirm = async () => {
    setShowCancelModal(false)
    try {
      await axios.post(`${API_URL}/cancel/${download.jobId}`)
    } catch (err) {
      console.error('Error cancelling:', err)
    }
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <>
      <div className="glass p-4 sm:p-6 space-y-4 sm:space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center text-xl flex-shrink-0">
            {formatIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1 break-words">
              {isPaused ? '⏸️ Paused' : 'Downloading...'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">{formatLabel}</p>
          </div>
          
          {/* Boutons pause et annuler */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handlePause}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 transition-colors"
              title="Cancel"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progression */}
        <ProgressBar progress={download.progress || 0} color={isPaused ? 'blue' : 'red'} />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-3 rounded-xl bg-white/5">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Progress</p>
            <p className="text-sm sm:text-lg font-bold text-white">{download.progress || 0}%</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-xl bg-white/5">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Speed</p>
            <p className="text-sm sm:text-lg font-bold text-white truncate">{isPaused ? 'Paused' : (download.speed || '--')}</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-xl bg-white/5">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Remaining</p>
            <p className="text-sm sm:text-lg font-bold text-white truncate">{isPaused ? '--' : (download.remaining || '--')}</p>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-xl bg-white/5">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Size</p>
            <p className="text-sm sm:text-lg font-bold text-white truncate">{download.totalSize || download.downloaded || '--'}</p>
          </div>
        </div>

        {/* Info vidéo */}
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5">
          <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={download.videoInfo?.thumbnail || ''}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-white line-clamp-2 break-words whitespace-normal">
              {download.videoInfo?.title || 'Unknown'}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              {download.videoInfo?.channel || ''}
            </p>
          </div>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
        </div>
      </div>

      {/* Modale de confirmation */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Download"
        message="Are you sure you want to cancel this download? The progress will be lost."
      />
    </>
  )
}