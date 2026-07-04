import { ArrowRight, Lock, Mail, Sparkles, User2Icon } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { login } from '../app/features/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')
  const [state, setState] = React.useState(urlState || 'login')

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`, formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
      navigate('/app')
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef2ff_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
              <Sparkles className="size-4" />
              Resume builder, reimagined
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-tight">Bring your best work forward with a polished, modern resume.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Everything from the first draft to live preview is designed to feel calm, focused, and professional.</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 text-sm text-slate-200">
            <p className="font-semibold text-white">What you get</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Smart structure and ATS-friendly suggestions</li>
              <li>• Multiple polished templates and styles</li>
              <li>• One-click sharing and exporting</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full p-6 sm:p-8 lg:p-10">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{state === 'login' ? 'Log in' : 'Create an account'}</h1>
            <p className="mt-2 text-sm text-slate-500">{state === 'login' ? 'Pick up where you left off and keep building.' : 'Start building a resume that feels sharp and personal.'}</p>
          </div>

          {state !== 'login' && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <User2Icon className="size-4 text-slate-500" />
              <input type="text" name="name" placeholder="Your name" className="w-full border-0 bg-transparent px-0" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <Mail className="size-4 text-slate-500" />
            <input type="email" name="email" placeholder="Email address" className="w-full border-0 bg-transparent px-0" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <Lock className="size-4 text-slate-500" />
            <input type="password" name="password" placeholder="Password" className="w-full border-0 bg-transparent px-0" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            {state === 'login' ? 'Log in' : 'Create account'} <ArrowRight className="size-4" />
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            {state === 'login' ? "Need an account?" : 'Already have one?'}{' '}
            <button type="button" onClick={() => setState((prev) => (prev === 'login' ? 'register' : 'login'))} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {state === 'login' ? 'Create one' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
