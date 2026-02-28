import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold text-lg">Payouts</Link>
            <Link to="/vendors" className="text-sm text-gray-600">Vendors</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm text-gray-700">{user.email} ({user.role})</div>
                <button className="text-sm text-red-600" onClick={() => logout()}>Logout</button>
              </>
            ) : (
              <button className="text-sm" onClick={() => nav('/login')}>Login</button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

export default Layout
