import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('RoundsAI crashed:', error, info)
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="max-w-sm text-center px-6 py-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
            <p className="text-3xl mb-3">⚠</p>
            <h1 className="text-lg font-semibold text-slate-100 mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-6">
              RoundsAI hit an unexpected error. Your data is safe — try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition"
            >
              Reload RoundsAI
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary