import { useState } from 'react'
import ConfirmModal from '../ui/ConfirmModal'

export default function HistoryPage({ history = [], onDelete }) {
  const [selected, setSelected] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selected.length === history.length) {
      setSelected([])
    } else {
      setSelected(history.map(item => item.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selected.length === 0) return
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    selected.forEach(id => {
      if (onDelete) onDelete(id)
    })
    setSelected([])
    setShowDeleteModal(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
          History
        </h1>
        
        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)' }}
            >
              {selected.length === history.length ? 'Deselect All' : 'Select All'}
            </button>
            {selected.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                Delete ({selected.length})
              </button>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass p-8 sm:p-12 text-center">
          <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">📭</span>
          <p className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No downloads yet
          </p>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your downloaded videos and music will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className={`glass p-3 sm:p-4 hover-glow transition-all duration-300 cursor-pointer ${
                selected.includes(item.id) ? 'border-red-500/50' : ''
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected.includes(item.id)
                    ? 'bg-red-500 border-red-500'
                    : 'border-gray-500'
                }`}>
                  {selected.includes(item.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="w-16 sm:w-20 h-10 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold line-clamp-1 break-words" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                      {item.format?.toUpperCase()}
                    </span>
                    {item.quality && (
                      <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        {item.quality}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onDelete) onDelete(item.id)
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center flex-shrink-0 transition-colors"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Selected Items"
        message={`Are you sure you want to delete ${selected.length} item(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
      />
    </div>
  )
}