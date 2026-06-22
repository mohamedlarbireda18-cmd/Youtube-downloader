import { useState } from 'react'
import ConfirmModal from '../ui/ConfirmModal'

const MAX_VISIBLE = 4

export default function URLHistory({ urls = [], onSelect, onClear, onRemove }) {
  const [showAll, setShowAll] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)

  if (!urls || urls.length === 0) return null

  const visibleUrls = showAll ? urls : urls.slice(0, MAX_VISIBLE)

  const handleClear = () => setShowClearModal(true)
  const confirmClear = () => {
    if (onClear) onClear()
    setShowClearModal(false)
  }
  const handleRemove = (e, urlToRemove) => {
    e.stopPropagation()
    if (onRemove) onRemove(urlToRemove)
  }

  return (
    <>
      <div className="mt-2 space-y-0.5">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Recent URLs
          </span>
          <button
            onClick={handleClear}
            className="text-[10px] sm:text-xs hover:underline transition-all"
            style={{ color: 'var(--red-text)' }}
          >
            Clear all
          </button>
        </div>
        <div className="space-y-0.5">
          {visibleUrls.map((url, index) => (
            <div
              key={index}
              className="w-full text-left text-xs truncate px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => onSelect(url)}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate flex-1">{url}</span>
              <span
                onClick={(e) => handleRemove(e, url)}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                           max-md:opacity-100 max-md:bg-red-500/10
                           md:opacity-0 md:group-hover:opacity-100 md:hover:bg-red-500/20"
                style={{ backgroundColor: 'var(--red-soft)' }}
                title="Remove from history"
              >
                <svg className="w-3.5 h-3.5" style={{ color: 'var(--red-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          ))}
        </div>
        {urls.length > MAX_VISIBLE && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs mt-1 px-3 py-1 transition-colors hover:underline"
            style={{ color: 'var(--red-text)' }}
          >
            {showAll ? 'Show less ▲' : `Show more (${urls.length - MAX_VISIBLE} more) ▼`}
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClear}
        title="Clear Search History"
        message="Are you sure you want to delete all your recent URLs? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
      />
    </>
  )
}