export default function QualitySelection({ formats = [], selectedQuality, onSelect }) {
  if (!formats || formats.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Quality</h3>
      <div className="flex flex-wrap gap-3">
        {formats.map((format) => (
          <button
            key={format.quality}
            onClick={() => onSelect(format.quality)}
            className="px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300"
            style={selectedQuality === format.quality
              ? { backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)', color: 'var(--red-text)', border: '1px solid var(--red-border)' }
              : { backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)', border: '1px solid transparent' }
            }
          >
            <span className="block">{format.quality}</span>
            <span className="text-xs opacity-70">
              {format.quality === '2160p' ? '4K' :
               format.quality === '1440p' ? '2K' :
               format.quality === '1080p' ? 'FHD' :
               format.quality === '720p' ? 'HD' : 'SD'}
            </span>
          </button>
        ))}
        <button
          onClick={() => onSelect('best')}
          className="px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300"
          style={selectedQuality === 'best'
            ? { backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)', color: 'var(--red-text)', border: '1px solid var(--red-border)' }
            : { backgroundColor: 'var(--stat-bg)', color: 'var(--text-secondary)', border: '1px solid transparent' }
          }
        >
          <span className="block">Best Quality</span>
          <span className="text-xs opacity-70">Up to 4K</span>
        </button>
      </div>
    </div>
  )
}