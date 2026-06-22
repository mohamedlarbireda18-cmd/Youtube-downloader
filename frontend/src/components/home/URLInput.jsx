export default function URLInput({ url, onChange, onAnalyze, loading = false }) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 glass-light input-focus px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          <input
            type="text"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            style={{ color: 'var(--text-primary)' }}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                onAnalyze()
              }
            }}
          />
          {loading && (
            <div className="flex-shrink-0 sm:hidden">
              <svg className="w-5 h-5 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="gradient-red hover:gradient-red-hover px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-white
                     transition-all duration-300 shadow-glow-red hover:shadow-glow-red-sm
                     hover:scale-105 active:scale-95 flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     w-full sm:w-auto"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="hidden sm:inline">Analyzing...</span>
              <span className="sm:hidden">Analyzing...</span>
            </>
          ) : (
            <>
              Analyze
              <span className="text-lg">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}