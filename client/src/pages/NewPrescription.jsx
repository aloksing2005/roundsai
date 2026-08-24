import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import MedicationRow from '../components/MedicationRow'
import { apiFetch, API_BASE_URL } from '../config/api'

const EMPTY_MED = { name: '', dosage: '', frequency: '', duration: '', notes: '' }

function isToday(date) {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

function NewPrescription() {
  const { id } = useParams()

  const [patient, setPatient] = useState(null)
  const [todaysVisit, setTodaysVisit] = useState(null)
  const [medications, setMedications] = useState([{ ...EMPTY_MED }])
  const [step, setStep] = useState('form')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [savedPrescription, setSavedPrescription] = useState(null)

  useEffect(() => {
    loadPatient()
  }, [id])

  async function loadPatient() {
    try {
      const data = await apiFetch(`/api/patients/${id}`)
      setPatient(data)
      const visit = data.visits?.find(v => isToday(v.date))
      setTodaysVisit(visit || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function updateMedication(index, updated) {
    setMedications(prev => prev.map((m, i) => (i === index ? updated : m)))
  }

  function addMedication() {
    setMedications(prev => [...prev, { ...EMPTY_MED }])
  }

  function removeMedication(index) {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  function goToReview() {
    setError('')
    const hasValid = medications.every(m => m.name.trim() && m.dosage.trim())
    if (!hasValid || medications.length === 0) {
      setError('At least one medication with a name and dosage is required')
      return
    }
    setStep('review')
  }

  async function handleConfirmSave() {
    if (!todaysVisit) {
      setError('No visit scheduled today for this patient — a prescription must be linked to a visit.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const prescription = await apiFetch('/api/prescriptions', {
        method: 'POST',
        body: JSON.stringify({
          patientId: id,
          visitId: todaysVisit._id,
          medications
        })
      })
      setSavedPrescription(prescription)
      setStep('saved')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </Layout>
    )
  }

  if (!todaysVisit && step === 'form') {
    return (
      <Layout>
        <Link to={`/patients/${id}`} className="text-slate-500 text-sm hover:text-slate-300">← Back</Link>
        <Card className="px-6 py-6 mt-4">
          <p className="text-amber-300 text-sm">
            ⚠ {patient?.name} doesn't have a visit scheduled today. A prescription must be linked to an active visit.
          </p>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      {step === 'form' && (
        <>
          <Link to={`/patients/${id}`} className="text-slate-500 text-sm hover:text-slate-300">← Back</Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-3 mb-6 break-words">New Prescription — {patient?.name}</h1>

          <div className="space-y-3 mb-4">
            {medications.map((med, i) => (
              <MedicationRow
                key={i}
                medication={med}
                index={i}
                onChange={updateMedication}
                onRemove={removeMedication}
                canRemove={medications.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addMedication}
            className="mb-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 active:scale-95 transition"
          >
            + Add Another Medication
          </button>

          {error && (
            <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">⚠ {error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/patients/${id}`}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 active:scale-95 transition text-center"
            >
              Cancel
            </Link>
            <button
              onClick={goToReview}
              className="px-4 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition"
            >
              Review Prescription
            </button>
          </div>
        </>
      )}

      {step === 'review' && (
        <>
          <button onClick={() => setStep('form')} className="text-slate-500 text-sm hover:text-slate-300">← Back to Edit</button>
          <h1 className="text-2xl font-bold text-slate-100 mt-3 mb-6">Review Prescription</h1>

          <Card className="px-6 py-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-4 pb-4 border-b border-white/10">
              <p className="text-slate-300 text-sm"><span className="text-slate-500">Patient:</span> {patient?.name}</p>
              <p className="text-slate-300 text-sm"><span className="text-slate-500">Date:</span> {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-4">
              {medications.map((med, i) => (
                <div key={i}>
                  <p className="text-slate-100 font-medium text-sm">{i + 1}. {med.name} — {med.dosage}</p>
                  {(med.frequency || med.duration) && (
                    <p className="text-slate-500 text-xs mt-1 ml-4">
                      {[med.frequency, med.duration].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {med.notes && <p className="text-slate-500 text-xs mt-0.5 ml-4">Note: {med.notes}</p>}
                </div>
              ))}
            </div>
          </Card>

          {error && (
            <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">⚠ {error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setStep('form')}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 active:scale-95 transition"
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Confirm & Save'}
            </button>
          </div>
        </>
      )}

      {step === 'saved' && savedPrescription && (
        <Card className="px-6 sm:px-8 py-10 text-center">
          <p className="text-emerald-400 text-lg font-semibold mb-2">✓ Prescription Saved</p>
          <p className="text-slate-400 text-sm mb-6">
            Prescription for {patient?.name} has been added to their record.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
           <a
  href={`${API_BASE_URL}/api/prescriptions/${savedPrescription._id}/pdf`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center px-4 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 transition"
>
  ⬇ Download PDF
</a>
            <Link
              to={`/patients/${id}`}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 active:scale-95 transition"
            >
              Back to Patient
            </Link>
          </div>
        </Card>
      )}
    </Layout>
  )
}

export default NewPrescription