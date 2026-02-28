import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const schema = z.object({ name: z.string().min(1), upi_id: z.string().optional(), bank_account: z.string().optional(), ifsc: z.string().optional() })
type Form = z.infer<typeof schema>

const VendorCreate: React.FC = () => {
  const { register, handleSubmit } = useForm<Form>({ resolver: zodResolver(schema) })
  const nav = useNavigate()

  const onSubmit = async (data: Form) => {
    try {
      await api.post('/vendors', data)
      toast.success('Vendor created')
      nav('/vendors')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Create failed')
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-3">Add Vendor</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name')} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">UPI</label>
          <input {...register('upi_id')} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm">Bank</label>
            <input {...register('bank_account')} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
          <div className="w-40">
            <label className="block text-sm">IFSC</label>
            <input {...register('ifsc')} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

export default VendorCreate
