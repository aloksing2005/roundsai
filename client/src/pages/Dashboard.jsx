import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import QueueCard from '../components/QueueCard'
import EmptyState from '../components/EmptyState'
import { apiFetch } from '../config/api'

const COLUMNS = [
  { key: 'waiting', label: 'Waiting', dot: 'bg-amber-400' },
  { key: 'in-progress', label: 'In Progress', dot: 'bg-cyan-400' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-400' }
]

function Dashboard() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [advancingId, setAdvancingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVisits()
  }, [])

  async function loadVisits() {
    try {
      const data = await apiFetch('/api/visits/today')
      setVisits(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdvance(visitId, newStatus) {
    setAdvancingId(visitId)
    try {
      const updated = await apiFetch(`/api/visits/${visitId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })
      setVisits(prev => prev.map(v => (v._id === visitId ? updated : v)))
    } catch (err) {
      setError(err.message)
    } finally {
      setAdvancingId(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Today's Queue</h1>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 inline-block">
            ⚠ {error}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(col => (
              <div key={col} className="space-y-3">
                <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                <div className="h-28 bg-white/5 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLUMNS.map(col => {
              const columnVisits = visits.filter(v => v.status === col.key)
              return (
                <div key={col.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {col.label} ({columnVisits.length})
                    </p>
                  </div>
                  <div className="space-y-3">
                    {columnVisits.length === 0 ? (
                      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                        <EmptyState message={`No patients ${col.label.toLowerCase()} right now.`} />
                      </div>
                    ) : (
                      columnVisits.map(visit => (
                        <QueueCard
                          key={visit._id}
                          visit={visit}
                          onAdvance={handleAdvance}
                          advancing={advancingId === visit._id}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard