const menuItems = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'downloads', icon: '⬇️', label: 'Downloads' },
  { id: 'history', icon: '🕐', label: 'History' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'playlists', icon: '📋', label: 'Playlists' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export default function Sidebar({ activePage, onPageChange, darkMode }) {
  return (
    <aside
      className="w-[260px] max-md:w-full max-md:h-[65px] h-screen fixed left-0 max-md:bottom-0 max-md:top-auto top-0 flex flex-col max-md:flex-row border-r max-md:border-r-0 max-md:border-t z-40"
      style={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--border-color)' }}
    >
      {/* Logo - caché sur mobile */}
      <div className="p-6 border-b max-md:hidden" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-glow-red-sm">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>YT Downloader</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>YouTube Downloader</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 max-md:py-0 max-md:px-1 space-y-1 max-md:space-y-0 max-md:flex max-md:flex-row max-md:items-center max-md:justify-around max-md:w-full overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`
              w-full max-md:w-auto flex items-center gap-3 max-md:gap-1 px-4 max-md:px-0 py-3 max-md:py-1.5 rounded-2xl text-sm font-medium
              transition-all duration-300 ease-out
              max-md:flex-col max-md:text-[10px] max-md:min-w-[56px] max-md:justify-center
              ${activePage === item.id
                ? 'gradient-red text-white shadow-glow-red'
                : ''
              }
            `}
            style={activePage !== item.id ? { color: 'var(--text-secondary)' } : {}}
          >
            <span className={`
              text-lg max-md:text-xl flex-shrink-0
              max-md:w-9 max-md:h-9 max-md:flex max-md:items-center max-md:justify-center max-md:rounded-xl
              ${activePage === item.id ? 'max-md:bg-red-600/30' : ''}
            `}>
              {item.icon}
            </span>
            <span className="max-md:text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile - caché sur mobile */}
      <div className="p-4 border-t max-md:hidden" style={{ borderColor: 'var(--border-color)' }}>
        <button
          className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group"
          style={{ backgroundColor: 'var(--stat-bg)' }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Log in</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Unlock pro features</p>
          </div>
          <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>
  )
}