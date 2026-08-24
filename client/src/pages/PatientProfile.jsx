import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import SummaryPanel from '../components/SummaryPanel'
import { apiFetch, API_BASE_URL } from '../config/api'

function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isToday(date) {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

function PatientProfile() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startingVisit, setStartingVisit] = useState(false)

  useEffect(() => {
    loadPatient()
    loadPrescriptions()
  }, [id])

  async function loadPatient() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch(`/api/patients/${id}`)
      setPatient(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadPrescriptions() {
    try {
      const data = await apiFetch(`/api/prescriptions/by-patient/${id}`)
      setPrescriptions(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleStartVisit() {
    setStartingVisit(true)
    setError('')
    try {
      await apiFetch('/api/visits', {
        method: 'POST',
        body: JSON.stringify({ patientId: id })
      })
      await loadPatient()
    } catch (err) {
      setError(err.message)
    } finally {
      setStartingVisit(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-white/5 rounded animate-pulse" />
          <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </Layout>
    )
  }

  if (error && !patient) {
    return (
      <Layout>
        <p className="text-red-400 text-sm">⚠ {error}</p>
      </Layout>
    )
  }

  if (!patient) {
    return (
      <Layout>
        <p className="text-red-400 text-sm">⚠ Patient not found</p>
      </Layout>
    )
  }

  const pastVisits = patient.visits?.filter(v => v.status === 'done') || []
  const todaysVisit = patient.visits?.find(v => isToday(v.date))

  return (
    <Layout>
      <Link to="/patients" className="text-slate-500 text-sm hover:text-slate-300">← Back</Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-100 truncate">{patient.name}</h1>
          <p className="text-slate-500 text-sm mt-1 capitalize">
            {patient.gender} · Age {calculateAge(patient.dob)}
          </p>
        </div>
        <Link
          to={`/patients/${patient._id}/edit`}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm font-medium hover:bg-white/10 active:scale-95 transition self-start sm:self-auto whitespace-nowrap"
        >
          Edit Patient
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">⚠ {error}</p>
      )}

      {!todaysVisit && (
        <Card className="px-5 py-4 mb-6 border-cyan-400/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-slate-200 text-sm font-medium">No visit scheduled today</p>
              <p className="text-slate-500 text-xs mt-0.5">Start today's visit to enable the AI summary, queue tracking, and prescriptions for this patient.</p>
            </div>
            <button
              onClick={handleStartVisit}
              disabled={startingVisit}
              className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
            >
              {startingVisit ? 'Starting...' : 'Start Today\'s Visit'}
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="px-5 py-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Allergies</p>
          {patient.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((a, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-sm">None recorded</p>
          )}
        </Card>

        <Card className="px-5 py-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Chronic Conditions</p>
          {patient.chronicConditions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {patient.chronicConditions.map((c, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">{c}</span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-sm">None recorded</p>
          )}
        </Card>
      </div>

      <Card className="px-5 py-4 mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Current Medications</p>
        {patient.currentMedications.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {patient.currentMedications.map((m, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">{m}</span>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm">None recorded</p>
        )}
      </Card>

      <Card className="px-5 py-4 mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Pre-Visit AI Summary</p>
        <SummaryPanel
          patientId={patient._id}
          visitId={todaysVisit?._id}
          initialSummary={todaysVisit?.summaryGenerated?.text ? todaysVisit.summaryGenerated : null}
        />
      </Card>

      <Card className="px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-3 gap-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Prescriptions</p>
          <Link
            to={`/patients/${patient._id}/prescriptions/new`}
            className="text-xs px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-medium hover:bg-cyan-400/20 active:scale-95 transition whitespace-nowrap"
          >
            + New Rx
          </Link>
        </div>
        {prescriptions.length === 0 ? (
          <EmptyState message="No prescriptions yet." />
        ) : (
          <div className="space-y-1">
            {prescriptions.map(rx => (
  <div key={rx._id} className="flex items-center justify-between gap-3 text-sm border-b border-white/5 py-2 last:border-0">
    <p className="text-slate-300 min-w-0 truncate">
      {formatDate(rx.createdAt)} — {rx.medications.map(m => m.name).join(', ')}
    </p>

    <a
      href={`${API_BASE_URL}/api/prescriptions/${rx._id}/pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-medium transition"
    >
      ⬇ PDF
    </a>
  </div>
))}
          </div>
        )}
      </Card>

      <Card className="px-5 py-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Past Visits</p>
        {pastVisits.length === 0 ? (
          <EmptyState message="No past visits recorded yet." />
        ) : (
          <div className="space-y-2">
            {pastVisits.map(visit => (
              <div key={visit._id} className="text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <p className="text-slate-300">{formatDate(visit.date)} — {visit.reasonForVisit}</p>
                {visit.diagnosisNotes && (
                  <p className="text-slate-500 mt-0.5">{visit.diagnosisNotes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  )
}

export default PatientProfile