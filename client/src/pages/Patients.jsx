import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import { apiFetch } from '../config/api'

function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  async function loadPatients() {
    try {
      const data = await apiFetch('/api/patients')
      setPatients(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-slate-100">Patients</h1>
        <Link
          to="/patients/new"
          className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition whitespace-nowrap"
        >
          + Add Patient
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && patients.length === 0 && (
        <Card>
          <EmptyState message="No patients yet — add your first patient to get started." />
        </Card>
      )}

      {!loading && patients.length > 0 && (
        <div className="space-y-3">
          {patients.map(patient => (
            <Link key={patient._id} to={`/patients/${patient._id}`}>
              <Card className="px-5 py-4 hover:bg-white/[0.07] hover:border-white/20 transition cursor-pointer">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-slate-100 font-medium truncate">
                      {patient.name} · <span className="text-slate-400 font-normal capitalize">{patient.gender}</span> · <span className="text-slate-400 font-normal">{calculateAge(patient.dob)}</span>
                    </p>
                    <p className="text-slate-500 text-sm mt-1 truncate">
                      {patient.chronicConditions.length > 0
                        ? patient.chronicConditions.join(', ')
                        : 'No chronic conditions on record'}
                    </p>
                  </div>
                  <span className="text-slate-600 flex-shrink-0">→</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default Patients