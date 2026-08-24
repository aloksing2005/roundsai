function MedicationRow({ medication, index, onChange, onRemove, canRemove }) {
  function handleChange(field, value) {
    onChange(index, { ...medication, [field]: value })
  }

  return (
    <div className="rounded-xl bg-slate-900/40 border border-white/10 px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Medication {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-xs text-red-400 hover:text-red-300 transition"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
          <input
            type="text"
            value={medication.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            placeholder="e.g. Metformin"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Dosage</label>
          <input
            type="text"
            value={medication.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            placeholder="e.g. 500mg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
          <input
            type="text"
            value={medication.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            placeholder="e.g. Twice daily"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
          <input
            type="text"
            value={medication.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            placeholder="e.g. 30 days"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
        <input
          type="text"
          value={medication.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
          placeholder="e.g. Take with food"
        />
      </div>
    </div>
  )
}

export default MedicationRow