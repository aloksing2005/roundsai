import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-sm text-center px-6 py-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
        <p className="text-4xl font-bold text-cyan-400 mb-2">404</p>
        <h1 className="text-lg font-semibold text-slate-100 mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm mb-6">
          This page doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound