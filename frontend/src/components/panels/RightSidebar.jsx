import CurrentDownload from './CurrentDownload'
import QueueCard from './QueueCard'
import HistoryCard from './HistoryCard'
import AnalyticsSection from './AnalyticsSection'

export default function RightSidebar({ currentDownload, queue = [], history = [], stats = {} }) {
  return (
    <aside className="w-[350px] h-screen fixed right-0 top-0 overflow-y-auto border-l border-white/5 bg-surface-950/50 backdrop-blur-xl p-4 space-y-4">
      <CurrentDownload download={currentDownload} />
      <QueueCard items={queue} />
      <HistoryCard items={history} />
      <AnalyticsSection stats={stats} />
      <div className="h-8" />
    </aside>
  )
}