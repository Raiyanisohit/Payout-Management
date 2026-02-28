import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Vendors from './pages/Vendors'
import VendorCreate from './pages/VendorCreate'
import PayoutsList from './pages/PayoutsList'
import PayoutCreate from './pages/PayoutCreate'
import PayoutDetail from './pages/PayoutDetail'

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
        <Route path="/vendors/new" element={<ProtectedRoute><VendorCreate /></ProtectedRoute>} />
        <Route path="/payouts" element={<ProtectedRoute><PayoutsList /></ProtectedRoute>} />
        <Route path="/payouts/new" element={<ProtectedRoute><PayoutCreate /></ProtectedRoute>} />
        <Route path="/payouts/:id" element={<ProtectedRoute><PayoutDetail /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/payouts" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
