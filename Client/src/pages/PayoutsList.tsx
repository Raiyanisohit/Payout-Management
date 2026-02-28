import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Payout, Vendor } from '../types'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'

const PayoutsList: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [status, setStatus] = useState('')
  const [vendor, setVendor] = useState('')

  const fetch = async () => {
    try {
      const q: any = {}
      if (status) q.status = status
      if (vendor) q.vendor = vendor
      const params = new URLSearchParams(q)
      const res = await api.get(`/payouts?${params.toString()}`)
      // backend may return either an array or a wrapper object; normalize to array
      const data = res.data
      const rawList = Array.isArray(data) ? data : (data?.payouts || data?.data || [])
      // normalize each payout to have `vendor` (object), `vendor_id` (string) and `auditTrail`
      const list = rawList.map((it: any) => ({
        ...it,
        vendor: it.vendor || it.vendor_id || null,
        vendor_id: typeof it.vendor_id === 'object' && it.vendor_id?._id ? it.vendor_id._id : (it.vendor_id || (it.vendor && it.vendor._id) || ''),
        auditTrail: it.auditTrail || it.audits || [],
      }))
      setPayouts(list)
    } catch (err) {
      toast.error('Failed to load payouts')
    }
  }

  useEffect(() => { api.get('/vendors').then(r => setVendors(Array.isArray(r.data) ? r.data : (r.data?.vendors || []))).catch(()=>{}) }, [])
  useEffect(() => { fetch() }, [status, vendor])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payouts</h2>
        <div className="flex gap-2">
          <Link to="/payouts/new" className="bg-blue-600 text-white px-3 py-1 rounded">New Payout</Link>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All statuses</option>
          <option>Draft</option>
          <option>Submitted</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <select value={vendor} onChange={e=>setVendor(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">All vendors</option>
          {vendors?.map(v=> <option value={v._id} key={v._id}>{String(v.name)}</option>)}
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Vendor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(payouts) ? payouts : []).map(p=> (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p?.vendor?.name ? String(p.vendor.name) : String(p.vendor_id ?? '-')}</td>
                <td className="p-3">₹{String(p.amount ?? '-')}</td>
                <td className="p-3">{String(p.mode ?? '')}</td>
                <td className="p-3"><StatusBadge status={String(p.status ?? '')} /></td>
                <td className="p-3"><Link to={`/payouts/${p._id}`} className="text-blue-600">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PayoutsList
