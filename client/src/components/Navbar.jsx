import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, UserCircle2 } from 'lucide-react'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = () => {
    navigate('/')
    dispatch(logout())
  }

  return (
    <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 text-slate-800 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-10 w-auto" />
          <span className="text-base font-semibold text-slate-900">ResuMate AI</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 sm:flex">
            <UserCircle2 className="size-4" />
            <span>{user?.name || 'Welcome'}</span>
          </div>
          <button onClick={logoutUser} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-indigo-300 hover:text-indigo-600">
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
