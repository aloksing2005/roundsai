import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">RoundsAI</h1>
          <p className="text-slate-500 text-sm mt-1">AI co-pilot for your clinic day</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-[0_0_40px_-10px_rgba(34,211,238,0.15)]"
        >
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-cyan-400 text-slate-950 font-semibold text-sm hover:bg-cyan-300 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 animate-fade-in">
              ⚠ {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login