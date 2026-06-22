import ProgressBar from '../ui/ProgressBar'

export default function CurrentDownload({ download }) {
  if (!download) return null

  return (
    <div className="glass p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Current Download
      </h3>

      <div className="flex gap-3">
        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={download.thumbnail}
            alt={download.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {download.title}
          </p>
          <p className="text-xs text-gray-500">{download.format} • {download.quality}</p>
        </div>
      </div>

      <ProgressBar progress={download.progress || 65} />

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-xl bg-white/5">
          <p className="text-xs text-gray-500 mb-1">Speed</p>
          <p className="text-sm font-semibold text-white">{download.speed || '2.8 MB/s'}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/5">
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className="text-sm font-semibold text-white">{download.remaining || '18s'}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/5">
          <p className="text-xs text-gray-500 mb-1">Downloaded</p>
          <p className="text-sm font-semibold text-white">{download.downloaded || '156 MB'}</p>
        </div>
      </div>
    </div>
  )
}