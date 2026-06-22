export default function VideoInfoCard({ info }) {
  if (!info) return null

  return (
    <div className="glass p-4 sm:p-6 hover-glow transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="relative w-full sm:w-64 h-44 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-md text-xs font-medium text-white">
            {info.duration}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 break-words whitespace-normal" style={{ color: 'var(--text-primary)' }}>
            {info.title}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{info.channel}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {info.duration}
            </span>
            <span>{info.views} views</span>
            {info.verified && (
              <span className="flex items-center gap-1 text-blue-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}