export default function AnalyticsPage({ stats = {}, history = [] }) {
  const cards = [
    { label: 'Downloads this month', value: stats.monthlyDownloads || '0', icon: '⬇️', color: 'from-blue-500/20 to-blue-600/20', textColor: 'from-blue-400 to-blue-300' },
    { label: 'Data downloaded', value: stats.dataDownloaded || '0 GB', icon: '💾', color: 'from-purple-500/20 to-purple-600/20', textColor: 'from-purple-400 to-purple-300' },
    { label: 'Average speed', value: stats.averageSpeed || '0 MB/s', icon: '⚡', color: 'from-yellow-500/20 to-orange-600/20', textColor: 'from-yellow-400 to-orange-300' },
    { label: 'Success rate', value: stats.successRate || '--', icon: '✅', color: 'from-green-500/20 to-emerald-600/20', textColor: 'from-green-400 to-emerald-300' },
  ]

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 lg:mb-8" style={{ color: 'var(--text-primary)' }}>
        Analytics
      </h1>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        {cards.map((card, index) => (
          <div key={index} className={`glass p-3 sm:p-4 lg:p-6 bg-gradient-to-br ${card.color} hover-glow`}>
            <span className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 block">{card.icon}</span>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.textColor} bg-clip-text text-transparent`}>
              {card.value}
            </p>
            <p className="text-[10px] sm:text-xs lg:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Activité récente */}
      <div className="glass p-3 sm:p-4 lg:p-6">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent Activity
        </h2>
        {history.length === 0 ? (
          <p className="text-center py-6 sm:py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            No activity yet
          </p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl" style={{ backgroundColor: 'var(--stat-bg)' }}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.format} • {item.quality || 'best'}
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}