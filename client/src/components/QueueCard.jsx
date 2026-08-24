import { Link } from 'react-router-dom'
import Card from './Card'
import StatusPill from './StatusPill'

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function QueueCard({ visit, onAdvance, advancing }) {
  const patientName = visit.patientId?.name || 'Unknown Patient'
  const patientId = visit.patientId?._id || visit.patientId

  return (
    <Card className="px-4 py-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <Link
          to={`/patients/${patientId}`}
          className="text-slate-100 font-medium text-sm hover:text-cyan-400 transition"
        >
          {patientName}
        </Link>
        <StatusPill status={visit.status} />
      </div>

      <p className="text-slate-500 text-xs mb-1">{formatTime(visit.date)}</p>
      {visit.reasonForVisit && (
        <p className="text-slate-400 text-xs mb-3 line-clamp-2">{visit.reasonForVisit}</p>
      )}

      {visit.status === 'waiting' && (
        <button
          onClick={() => onAdvance(visit._id, 'in-progress')}
          disabled={advancing}
          className="w-full mt-2 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-medium hover:bg-cyan-400/20 hover:border-cyan-400/50 transition disabled:opacity-50"
        >
          {advancing ? 'Updating...' : 'Start Visit ▶'}
        </button>
      )}

      {visit.status === 'in-progress' && (
        <button
          onClick={() => onAdvance(visit._id, 'done')}
          disabled={advancing}
          className="w-full mt-2 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-medium hover:bg-emerald-400/20 hover:border-emerald-400/50 transition disabled:opacity-50"
        >
          {advancing ? 'Updating...' : 'Mark Done ✓'}
        </button>
      )}

      {visit.status === 'done' && (
        <p className="w-full mt-2 py-2 text-center text-emerald-400 text-xs font-medium">
          ✓ Complete
        </p>
      )}
    </Card>
  )
}

export default QueueCard