export default function GlassCard({ children, className = '', hover = false, glow = false }) {
  return (
    <div className={`
      glass p-6
      ${hover ? 'glass-hover cursor-pointer' : ''}
      ${glow ? 'glow-red' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}