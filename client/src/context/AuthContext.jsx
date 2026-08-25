import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const data = await apiFetch('/api/auth/me')
      setDoctor(data.doctor)
    } catch {
      setDoctor(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    setDoctor(data.doctor)
    return data.doctor
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.warn('Logout request failed:', err.message)
    } finally {
      setDoctor(null)
    }
  }

  return (
    <AuthContext.Provider value={{ doctor, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}