export default function FormatSelection({ selectedFormat, onSelect }) {
  const formats = [
    { id: 'mp3', icon: '🎵', label: 'MP3', desc: 'Audio only' },
    { id: 'mp4', icon: '🎬', label: 'MP4', desc: 'Video' },
  ]

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Choose Format</h3>
      <div className="grid grid-cols-2 gap-4">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onSelect(format.id)}
            className="glass p-4 sm:p-5 text-left transition-all duration-300 hover-glow"
            style={selectedFormat === format.id ? { borderColor: 'var(--red-border)' } : {}}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{format.icon}</span>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{format.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{format.desc}</p>
              </div>
              {selectedFormat === format.id && (
                <div className="ml-auto w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}