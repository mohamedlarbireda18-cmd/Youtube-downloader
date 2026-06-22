export default function PlaylistsPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
        Playlists
      </h1>
      
      <div className="glass p-6 sm:p-12 text-center">
        <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">📋</span>
        <p className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Coming Soon</p>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Playlist download feature will be available in a future update
        </p>
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl" style={{ backgroundColor: 'var(--red-soft)' }}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs sm:text-sm" style={{ color: 'var(--red-text)' }}>In Development</span>
        </div>
      </div>
    </div>
  )
}