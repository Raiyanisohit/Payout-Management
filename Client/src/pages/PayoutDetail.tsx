import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { Payout } from '../types'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PayoutDetail: React.FC = () => {
  const { id } = useParams()
  const [payout, setPayout] = useState<Payout | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [reason, setReason] = useState('')

  const fetch = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await api.get(`/payouts/${id}`)
      const data = res.data
      // backend may return { payout } or the payout directly
      const raw = data?.payout || data
      // normalize vendor and auditTrail fields
      const normalized = {
        ...raw,
        vendor: raw.vendor || raw.vendor_id || (raw.vendor_id?._id ? raw.vendor_id : null),
        vendor_id: typeof raw.vendor_id === 'object' && raw.vendor_id?._id ? raw.vendor_id._id : (raw.vendor_id || (raw.vendor && raw.vendor._id) || ''),
        auditTrail: (raw.auditTrail || raw.audits || []).map((a: any) => ({
          action: a.action,
          by: typeof a.performedBy === 'object' ? (a.performedBy.email || a.performedBy._id) : a.performedBy,
          at: a.timestamp || a.at || a.createdAt,
          reason: a.decision_reason || a.reason || a.note
        })),
      }
      setPayout(normalized)
    } catch (err) {
      toast.error('Failed to load')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [id])

  const submit = async () => {
    try { await api.post(`/payouts/${id}/submit`); toast.success('Submitted'); fetch() } catch (e:any){ toast.error(e?.response?.data?.message||'Failed') }
  }
  const approve = async () => {
    try { await api.post(`/payouts/${id}/approve`); toast.success('Approved'); fetch() } catch (e:any){ toast.error(e?.response?.data?.message||'Failed') }
  }
  const reject = async () => {
    if (!reason) return toast.error('Reason required')
    try { await api.post(`/payouts/${id}/reject`, { decision_reason: reason }); toast.success('Rejected'); fetch() } catch (e:any){ toast.error(e?.response?.data?.message||'Failed') }
  }

  if (loading) return <div>Loading...</div>
  if (!payout) return <div>Not found</div>

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">Payout #{payout._id}</h3>
          <div className="text-sm text-gray-600">Vendor: {payout.vendor?.name || payout.vendor_id}</div>
        </div>
        <StatusBadge status={payout.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div><strong>Amount</strong><div>₹{payout.amount}</div></div>
        <div><strong>Mode</strong><div>{payout.mode}</div></div>
        <div className="col-span-2"><strong>Note</strong><div>{payout.note || '-'}</div></div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold">Audit Trail</h4>
        <ul className="mt-2 space-y-2">
          {payout.auditTrail?.map((a, i) => (
            <li key={i} className="text-sm text-gray-700">{a.at} — {a.action} by {a.by} {a.reason ? `: ${a.reason}` : ''}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-2">
        {user?.role === 'OPS' && payout.status === 'Draft' && (
          <button onClick={submit} className="bg-yellow-600 text-white px-3 py-1 rounded">Submit</button>
        )}

        {user?.role === 'FINANCE' && payout.status === 'Submitted' && (
          <>
            <button onClick={approve} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
            <div className="flex items-center gap-2">
              <input placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} className="border px-2 py-1 rounded" />
              <button onClick={reject} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PayoutDetail
