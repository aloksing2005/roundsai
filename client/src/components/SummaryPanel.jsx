import { useState } from 'react'
import { apiFetch } from '../config/api'

function formatGeneratedAt(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })
}

function SummaryPanel({ patientId, visitId, initialSummary }) {
  const [summary, setSummary] = useState(initialSummary || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch(`/api/patients/${patientId}/summary`, {
        method: 'POST',
        body: JSON.stringify({ visitId })
      })
      setSummary(data)
    } catch (err) {
      setError(err.message || 'Could not generate summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!visitId) {
    return (
      <p className="text-slate-600 text-sm">
        No visit scheduled today for this patient — summary generation requires an active visit.
      </p>
    )
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating summary...' : summary ? 'Regenerate Summary' : 'Generate Pre-Visit Summary'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          ⚠ {error}
        </p>
      )}

      {summary && !loading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            {summary.source === 'claude' ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-medium">
                ✓ Claude AI Summary
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-medium">
                ⚠ Fallback Summary — AI temporarily unavailable
              </span>
            )}
            <span className="text-xs text-slate-600">{formatGeneratedAt(summary.generatedAt)}</span>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3">
            <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{summary.text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryPanel