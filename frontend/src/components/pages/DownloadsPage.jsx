import ProgressBar from '../ui/ProgressBar'

export default function DownloadsPage({ currentDownload, queue = [] }) {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
        Downloads
      </h1>

      {/* Téléchargement en cours */}
      {currentDownload ? (
        <div className="glass p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Current Download
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-32 h-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src={currentDownload.videoInfo?.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold line-clamp-2 break-words whitespace-normal" style={{ color: 'var(--text-primary)' }}>
                {currentDownload.videoInfo?.title}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                {currentDownload.format} {currentDownload.quality && `• ${currentDownload.quality}`}
              </p>
            </div>
          </div>

          <ProgressBar progress={currentDownload.progress || 0} />
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Speed', value: currentDownload.speed || '--' },
              { label: 'Remaining', value: currentDownload.remaining || '--' },
              { label: 'Downloaded', value: currentDownload.downloaded || '--' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-2 sm:p-3 rounded-xl" style={{ backgroundColor: 'var(--stat-bg)' }}>
                <p className="text-[10px] sm:text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-center py-6 sm:py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>No active download</p>
        </div>
      )}

      {/* File d'attente */}
      <div className="glass p-3 sm:p-4 lg:p-6">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
          Queue
          {queue.length > 0 && (
            <span className="ml-2 text-xs sm:text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
              ({queue.length} pending)
            </span>
          )}
        </h2>
        
        {queue.length === 0 ? (
          <p className="text-center py-4 sm:py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>Queue is empty</p>
        ) : (
          <div className="space-y-2">
            {queue.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200"
                style={{ backgroundColor: 'var(--stat-bg)' }}
              >
                <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium line-clamp-2 break-words whitespace-normal" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.format} {item.quality && `• ${item.quality}`}
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--yellow-soft)', color: 'var(--yellow-text)' }}>
                  Queued
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}