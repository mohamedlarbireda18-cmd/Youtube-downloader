export default function SettingsPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>

      <div className="space-y-3 sm:space-y-4">
        {/* Download Location */}
        <div className="glass p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>Download Location</h3>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl" style={{ backgroundColor: 'var(--stat-bg)' }}>
            <span className="text-lg sm:text-xl">📁</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-mono truncate" style={{ color: 'var(--text-primary)' }}>youtube-downloader/downloads/</p>
              <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>Files are saved locally</p>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-colors text-xs sm:text-sm flex-shrink-0" style={{ backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)' }}>
              Change
            </button>
          </div>
        </div>

        {/* Default Format */}
        <div className="glass p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>Default Format</h3>
          <div className="flex gap-2 sm:gap-3">
            <button className="flex-1 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium" style={{ backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)', color: 'var(--red-text)' }}>
              MP4 Video
            </button>
            <button className="flex-1 py-2 sm:py-3 rounded-xl text-xs sm:text-sm transition-colors" style={{ backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)' }}>
              MP3 Audio
            </button>
          </div>
        </div>

        {/* Default Quality */}
        <div className="glass p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>Default Quality</h3>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {['360p', '720p', '1080p', 'Best'].map(q => (
              <button key={q} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                q === '1080p' 
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                  : ''
              }`}
              style={q !== '1080p' ? { backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)' } : {}}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="glass p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>About</h3>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>YT Downloader v1.0.0</p>
          <p className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Built with React, Express, yt-dlp & FFmpeg</p>
        </div>
      </div>
    </div>
  )
}