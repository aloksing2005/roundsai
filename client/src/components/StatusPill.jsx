const STATUS_CONFIG = {
  waiting: { label: 'Waiting', color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
  'in-progress': { label: 'In Progress', color: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20' },
  done: { label: 'Done', color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20' }
}

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.waiting
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

export default StatusPill