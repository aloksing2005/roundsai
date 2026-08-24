import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import { apiFetch } from '../config/api'

function toDateInputValue(date) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

function AddEditPatient() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [allergies, setAllergies] = useState('')
  const [chronicConditions, setChronicConditions] = useState('')
  const [currentMedications, setCurrentMedications] = useState('')

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) loadPatient()
  }, [id])

  async function loadPatient() {
    try {
      const data = await apiFetch(`/api/patients/${id}`)
      setName(data.name)
      setDob(toDateInputValue(data.dob))
      setGender(data.gender)
      setAllergies(data.allergies.join('\n'))
      setChronicConditions(data.chronicConditions.join('\n'))
      setCurrentMedications(data.currentMedications.join('\n'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function linesToArray(text) {
    return text.split('\n').map(s => s.trim()).filter(Boolean)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }
    if (!dob) {
      setError('Date of birth is required')
      return
    }
    if (!gender) {
      setError('Please select a gender')
      return
    }

    setSubmitting(true)
    const payload = {
      name: name.trim(),
      dob,
      gender,
      allergies: linesToArray(allergies),
      chronicConditions: linesToArray(chronicConditions),
      currentMedications: linesToArray(currentMedications)
    }

    try {
      let patient
      if (isEdit) {
        patient = await apiFetch(`/api/patients/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      } else {
        patient = await apiFetch('/api/patients', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }
      navigate(`/patients/${patient._id}`)
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

  return (
    <Layout>
      <Link to={isEdit ? `/patients/${id}` : '/patients'} className="text-slate-500 text-sm hover:text-slate-300">← Back</Link>

      <h1 className="text-2xl font-bold text-slate-100 mt-3 mb-6">
        {isEdit ? `Edit Patient` : 'Add New Patient'}
      </h1>

      <Card className="px-5 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Allergies (one per line)</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Chronic Conditions (one per line)</label>
            <textarea
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Medications (one per line)</label>
            <textarea
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">⚠ {error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              to={isEdit ? `/patients/${id}` : '/patients'}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 active:scale-95 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg bg-cyan-400 text-slate-950 text-sm font-semibold hover:bg-cyan-300 active:scale-95 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </Card>
    </Layout>
  )
}

export default AddEditPatient