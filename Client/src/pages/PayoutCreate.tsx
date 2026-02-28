import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Vendor } from '../types'

const schema = z.object({ vendor_id: z.string().min(1), amount: z.number().positive(), mode: z.enum(['UPI','IMPS','NEFT']), note: z.string().optional() })
type Form = z.infer<typeof schema>

const PayoutCreate: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<Form>({ resolver: zodResolver(schema) })
  const [vendors, setVendors] = useState<Vendor[]>([])
  const nav = useNavigate()

  useEffect(() => { api.get('/vendors').then(r=>setVendors(r.data?.vendors || [])).catch(()=>{}) }, [])

  const onSubmit = async (data: Form) => {
    try {
      await api.post('/payouts', data)
      toast.success('Payout created (Draft)')
      nav('/payouts')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Create failed')
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-3">Create Payout</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Vendor</label>
          <select {...register('vendor_id')} className="mt-1 w-full border px-3 py-2 rounded">
            <option value="">Select vendor</option>
            {vendors.map(v=> <option key={v._id} value={v._id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Amount</label>
          <input type="number" step="0.01" onChange={e=> setValue('amount', Number(e.target.value))} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Mode</label>
          <select {...register('mode')} className="mt-1 w-full border px-3 py-2 rounded">
            <option value="UPI">UPI</option>
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Note</label>
          <textarea {...register('note')} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Draft</button>
        </div>
      </form>
    </div>
  )
}

export default PayoutCreate
