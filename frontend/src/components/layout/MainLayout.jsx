import Sidebar from './Sidebar'
import ThemeToggle from '../ui/ThemeToggle'

export default function MainLayout({ children, activePage, onPageChange, darkMode, toggleTheme }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        darkMode={darkMode}
      />
      
      <main className="ml-[260px] max-md:ml-0 max-md:mb-[70px] flex-1 p-4 sm:p-6 lg:p-8 min-h-screen w-full overflow-x-hidden">
        {/* Theme Toggle - Positionné en haut à droite */}
        <div className="fixed top-4 right-4 z-50 max-md:top-3 max-md:right-3">
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
        
        <div className="w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}