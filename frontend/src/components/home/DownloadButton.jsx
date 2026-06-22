export default function DownloadButton({ onClick, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full gradient-red hover:gradient-red-hover py-4 sm:py-5 px-8 rounded-3xl
                 text-white font-bold text-base sm:text-lg transition-all duration-300
                 shadow-glow-red hover:shadow-glow-red-sm
                 hover:scale-[1.02] active:scale-[0.98]
                 flex items-center justify-center gap-3
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {loading ? (
        <>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Starting Download...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </>
      )}
    </button>
  )
}