import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type Form = z.infer<typeof schema>

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    event?.preventDefault()
    try {
      await login(data.email, data.password)
      console.log('Login successful')
      toast.success('Logged in')
      navigate('/payouts')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email')} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password')} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          <div className="text-sm text-gray-600">Try ops@demo.com / ops123</div>
        </div>
      </form>
    </div>
  )
}

export default Login
