import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientProfile from './pages/PatientProfile'
import AddEditPatient from './pages/AddEditPatient'
import NewPrescription from './pages/NewPrescription'
import NotFound from './pages/NotFound'

function Footer() {
  return (
    <footer className="text-center py-3 text-xs text-slate-600 border-t border-white/5">
      Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.
    </footer>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-950">
            <div className="flex-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                <Route path="/patients/new" element={<ProtectedRoute><AddEditPatient /></ProtectedRoute>} />
                <Route path="/patients/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
                <Route path="/patients/:id/edit" element={<ProtectedRoute><AddEditPatient /></ProtectedRoute>} />
                <Route path="/patients/:id/prescriptions/new" element={<ProtectedRoute><NewPrescription /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App