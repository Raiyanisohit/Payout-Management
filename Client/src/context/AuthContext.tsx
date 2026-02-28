import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

type User = { email: string; role: string }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('payout_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('payout_token'))

  useEffect(() => {
    if (token) localStorage.setItem('payout_token', token)
    else localStorage.removeItem('payout_token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('payout_user', JSON.stringify(user))
    else localStorage.removeItem('payout_user')
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token: tkn, user: u } = res.data
      setToken(tkn)
      setUser(u)
    } catch (err) {
      // rethrow so callers (pages) can show toast/errors
      throw err
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('payout_token')
    localStorage.removeItem('payout_user')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}
