import { useState } from 'react'

export default function ThemeToggle({ darkMode, toggleTheme }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <label 
      className="relative inline-block cursor-pointer"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        checked={darkMode}
        onChange={handleToggle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute opacity-0 w-0 h-0"
        aria-label="Toggle dark mode"
      />
      
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 110 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-110"
      >
        {/* Cercle extérieur */}
        <circle 
          cx="55" cy="55" r="50" 
          fill={darkMode ? '#1e293b' : '#ffffff'}
          stroke={isHovered || isFocused 
            ? (darkMode ? '#ffffff' : '#334155') 
            : (darkMode ? 'rgba(0, 9, 87, 0.15)' : 'rgba(0,0,0,0.2)')
          }
          strokeWidth="4"
          className="transition-all duration-300"
        />
        
        {/* Groupe avec rotation animée */}
        <g 
          style={{ 
            transformOrigin: '55px 55px',
            animation: isAnimating ? 'themeRotate 0.6s ease-in-out' : 'none'
          }}
        >
          {darkMode ? (
            // === SOLEIL ===
            <>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 55 + 26 * Math.cos(rad)
                const y1 = 55 + 26 * Math.sin(rad)
                const x2 = 55 + 36 * Math.cos(rad)
                const y2 = 55 + 36 * Math.sin(rad)
                return (
                  <line 
                    key={i}
                    x1={x1} y1={y1} 
                    x2={x2} y2={y2} 
                    stroke="#fbbf24" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                )
              })}
              <circle cx="55" cy="55" r="17" fill="#f59e0b" />
              <circle cx="55" cy="55" r="22" fill="url(#sunGlow)" />
              <defs>
                <radialGradient id="sunGlow">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </radialGradient>
              </defs>
            </>
          ) : (
            // === LUNE (croissant agrandi) ===
            <>
              {/* Cercle violet - plus grand */}
              <circle cx="52" cy="52" r="24" fill="#818cf8" />
              {/* Cercle décalé - plus grand et plus décalé */}
              <circle cx="62" cy="45" r="20" fill="#ffffff" />
              {/* Étoiles décoratives */}
              <circle cx="28" cy="36" r="2.5" fill="#a5b4fc" opacity="0.8" />
              <circle cx="78" cy="68" r="1.8" fill="#a5b4fc" opacity="0.6" />
              <circle cx="76" cy="28" r="1.5" fill="#a5b4fc" opacity="0.5" />
              <circle cx="38" cy="74" r="1.8" fill="#a5b4fc" opacity="0.4" />
            </>
          )}
        </g>
      </svg>

      <style>{`
        @keyframes themeRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          30% {
            transform: rotate(180deg) scale(0.8);
          }
          60% {
            transform: rotate(360deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
      `}</style>
    </label>
  )
}