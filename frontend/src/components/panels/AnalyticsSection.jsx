export default function AnalyticsSection({ stats = {} }) {
  const cards = [
    {
      label: 'Downloads this month',
      value: stats.monthlyDownloads || '24',
      icon: '⬇️',
      gradient: 'from-blue-500/20 to-blue-600/20',
      textGradient: 'from-blue-400 to-blue-300',
    },
    {
      label: 'Data downloaded',
      value: stats.dataDownloaded || '12.4 GB',
      icon: '💾',
      gradient: 'from-purple-500/20 to-purple-600/20',
      textGradient: 'from-purple-400 to-purple-300',
    },
    {
      label: 'Average speed',
      value: stats.averageSpeed || '2.8 MB/s',
      icon: '⚡',
      gradient: 'from-yellow-500/20 to-orange-600/20',
      textGradient: 'from-yellow-400 to-orange-300',
    },
    {
      label: 'Success rate',
      value: stats.successRate || '98%',
      icon: '✅',
      gradient: 'from-green-500/20 to-emerald-600/20',
      textGradient: 'from-green-400 to-emerald-300',
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">
        Analytics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`glass-light p-4 bg-gradient-to-br ${card.gradient} hover:scale-[1.02] transition-transform duration-300`}
          >
            <span className="text-2xl mb-2 block">{card.icon}</span>
            <p className={`text-xl font-bold bg-gradient-to-r ${card.textGradient} bg-clip-text text-transparent`}>
              {card.value}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}