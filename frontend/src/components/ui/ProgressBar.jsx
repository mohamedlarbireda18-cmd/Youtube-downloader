export default function ProgressBar({ progress = 0, color = 'red', showPercentage = true }) {
  const colors = {
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
  }

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-red-400">{progress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}