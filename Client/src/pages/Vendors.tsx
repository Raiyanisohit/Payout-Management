import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Vendor } from '../types'
import toast from 'react-hot-toast'

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get('/vendors')
      setVendors(res.data.vendors || [])
    } catch (err: any) {
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vendors</h2>
        <Link to="/vendors/new" className="bg-blue-600 text-white px-3 py-1 rounded">Add Vendor</Link>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">UPI</th>
                <th className="p-3">Bank</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-t">
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.upi_id || '-'}</td>
                  <td className="p-3">{v.bank_account || '-'}</td>
                  <td className="p-3">{v.is_active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Vendors
