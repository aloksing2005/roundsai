import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar({ open, onClose }) {
  const { doctor, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 shadow-[0_0_0_1px_rgba(34,211,238,0.1)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
    }`

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-slate-950 border-r border-white/10 flex flex-col px-4 py-6 z-40 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)]" />
            <span className="text-slate-100 font-semibold text-sm">RoundsAI</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-slate-300 text-lg leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <span>🏠</span> Dashboard
          </NavLink>
          <NavLink to="/patients" className={linkClass} onClick={onClose}>
            <span>👥</span> Patients
          </NavLink>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-slate-500 px-2 mb-2 truncate">{doctor?.name}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition"
          >
            ⎋ Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar