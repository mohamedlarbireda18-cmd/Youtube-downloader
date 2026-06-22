import { useEffect, useState } from 'react'
import { API_URL } from '../../config'
import ConfirmModal from '../ui/ConfirmModal'

export default function DownloadComplete({ download, onReset }) {
  const [showSaveMessage, setShowSaveMessage] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!download) return null

  const handleSave = async (e) => {
    e.preventDefault()
    
    const downloadUrl = `${API_URL}/download-file/${download.jobId}`
    
    try {
      const response = await fetch(downloadUrl, { method: 'HEAD' })
      
      if (!response.ok) {
        setErrorMessage('This file is no longer available on the server. It may have been automatically cleaned up. Please download the video again.')
        setShowErrorModal(true)
        return
      }

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = download.fileName || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setErrorMessage('Unable to reach the server. Please check your connection and try again.')
      setShowErrorModal(true)
    }
  }

  useEffect(() => {
    if (download.jobId && showSaveMessage) {
      const timer = setTimeout(() => {
        setShowSaveMessage(false)
        const downloadUrl = `${API_URL}/download-file/${download.jobId}`
        
        fetch(downloadUrl, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              const link = document.createElement('a')
              link.href = downloadUrl
              link.download = download.fileName || 'download'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              setErrorMessage('This file is no longer available on the server. It may have been automatically cleaned up. Please download the video again.')
              setShowErrorModal(true)
            }
          })
          .catch(() => {
            setErrorMessage('Unable to reach the server. Please check your connection and try again.')
            setShowErrorModal(true)
          })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [download, showSaveMessage])

  return (
    <>
      <div className="glass p-4 sm:p-6 space-y-4 sm:space-y-5 animate-fadeIn border-green-500/30">
        {/* Message de préparation */}
        {showSaveMessage && (
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-pulse">
            <span className="text-xl sm:text-2xl">📱</span>
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-400">Preparing download...</p>
              <p className="text-[10px] sm:text-xs text-blue-300/70">Le téléchargement va débuter sur votre appareil</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Download Complete!</h3>
            <p className="text-xs sm:text-sm line-clamp-2 break-words whitespace-normal" style={{ color: 'var(--text-secondary)' }}>
              {download.videoInfo?.title || 'Your file has been saved'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <span className="text-xl sm:text-2xl">📁</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm line-clamp-1 break-words" style={{ color: 'var(--text-primary)' }}>{download.fileName || 'File saved'}</p>
            <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>{download.fileSize || 'Unknown size'}</p>
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs sm:text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl text-sm sm:text-base font-medium transition-all duration-300"
          style={{ backgroundColor: 'var(--stat-bg)', color: 'var(--text-primary)' }}
        >
          Download Another Video
        </button>
      </div>

      {/* Modale d'erreur */}
      <ConfirmModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => {
          setShowErrorModal(false)
          if (onReset) onReset()
        }}
        title="File Not Found"
        message={errorMessage}
        confirmText="Download Again"
        cancelText="Close"
        type="danger"
      />
    </>
  )
}