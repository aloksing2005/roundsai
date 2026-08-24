import { useState } from 'react'
import Sidebar from './Sidebar'

function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/10 sticky top-0 bg-slate-950/95 backdrop-blur z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white p-1"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-100 font-semibold text-sm">RoundsAI</span>
          </div>
          <div className="w-6" />
        </div>

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-3xl w-full mx-auto md:mx-0 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout