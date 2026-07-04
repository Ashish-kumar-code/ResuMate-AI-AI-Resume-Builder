import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)

  const colors = ['#7c3aed', '#0f766e', '#dc2626', '#0284c7', '#16a34a']
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [showUploadATS, setShowUploadATS] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const uploadResumeForATS = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      setShowUploadATS(false)
      navigate(`/app/ats/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }

    setIsLoading(false)
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.put(`/api/resumes/update`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map((resume) => (resume._id === editResumeId ? { ...resume, title } : resume)))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId))
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.15),_transparent_22%),linear-gradient(135deg,_#f8fbff_0%,_#f5f7ff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Resume workspace</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back, {user?.name || 'there'}.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Create a fresh draft, improve an existing version, or upload a PDF and jump straight into ATS coaching.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {allResumes.length} resume{allResumes.length === 1 ? '' : 's'} ready to refine
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <button onClick={() => setShowCreateResume(true)} className="flex min-h-40 flex-col items-start justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-left transition hover:border-indigo-400 hover:bg-indigo-50">
              <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600">
                <PlusIcon className="size-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">Create new resume</p>
                <p className="mt-1 text-sm text-slate-600">Start from a blank canvas with a polished structure.</p>
              </div>
            </button>

            <button onClick={() => setShowUploadResume(true)} className="flex min-h-40 flex-col items-start justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-left transition hover:border-violet-400 hover:bg-violet-50">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                <UploadCloudIcon className="size-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">Upload existing PDF</p>
                <p className="mt-1 text-sm text-slate-600">Turn a current resume into a refined editable version.</p>
              </div>
            </button>

            <button onClick={() => setShowUploadATS(true)} className="flex min-h-40 flex-col items-start justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
                <UploadCloudIcon className="size-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">Analyze for ATS</p>
                <p className="mt-1 text-sm text-slate-600">Upload a resume and compare it against a target role.</p>
              </div>
            </button>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Your resumes</h2>
              <p className="text-sm text-slate-500">Tap a card to continue editing.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {allResumes.map((resume, index) => {
                const baseColor = colors[index % colors.length]
                return (
                  <div key={resume._id} className="group relative rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <button onClick={() => navigate(`/app/builder/${resume._id}`)} className="w-full text-left">
                      <div className="flex items-center justify-between">
                        <div className="rounded-2xl p-3" style={{ background: `${baseColor}15`, color: baseColor }}>
                          <FilePenLineIcon className="size-5" />
                        </div>
                        <div className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                          Draft
                        </div>
                      </div>
                      <p className="mt-4 text-base font-semibold text-slate-900">{resume.title}</p>
                      <p className="mt-2 text-sm text-slate-500">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                    </button>
                    <div className="mt-5 flex items-center justify-between">
                      <button onClick={() => navigate(`/app/ats/${resume._id}`)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600">
                        ATS
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                          <PencilIcon className="size-4" />
                        </button>
                        <button onClick={() => deleteResume(resume._id)} className="rounded-full p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {showCreateResume && (
          <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-900">Create a resume</h2>
              <p className="mt-1 text-sm text-slate-500">Give your new draft a title and continue into the builder.</p>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="mt-4 w-full" required />
              <button className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Create Resume</button>
              <XIcon className="absolute right-4 top-4 size-5 cursor-pointer text-slate-400 transition hover:text-slate-700" onClick={() => { setShowCreateResume(false); setTitle('') }} />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-900">Upload a PDF</h2>
              <p className="mt-1 text-sm text-slate-500">We’ll extract the content and place it into your builder.</p>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="mt-4 w-full" required />
              <label htmlFor="resume-input" className="mt-4 block text-sm text-slate-700">
                Select resume file
                <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4 py-10 text-slate-400 transition hover:border-indigo-400 hover:text-indigo-600">
                  {resume ? <p className="text-sm font-medium text-emerald-700">{resume.name}</p> : <><UploadCloud className="size-12 stroke-1" /><p>Upload resume</p></>}
                </div>
              </label>
              <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
              <button disabled={isLoading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                {isLoading && <LoaderCircleIcon className="size-4 animate-spin" />}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon className="absolute right-4 top-4 size-5 cursor-pointer text-slate-400 transition hover:text-slate-700" onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null) }} />
            </div>
          </form>
        )}

        {showUploadATS && (
          <form onSubmit={uploadResumeForATS} onClick={() => setShowUploadATS(false)} className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-900">Upload for ATS review</h2>
              <p className="mt-1 text-sm text-slate-500">We’ll prepare it for a targeted resume scan.</p>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="mt-4 w-full" required />
              <label htmlFor="resume-input-ats" className="mt-4 block text-sm text-slate-700">
                Select resume file
                <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4 py-10 text-slate-400 transition hover:border-emerald-400 hover:text-emerald-600">
                  {resume ? <p className="text-sm font-medium text-emerald-700">{resume.name}</p> : <><UploadCloud className="size-12 stroke-1" /><p>Upload resume</p></>}
                </div>
              </label>
              <input type="file" id="resume-input-ats" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
              <button disabled={isLoading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                {isLoading && <LoaderCircleIcon className="size-4 animate-spin" />}
                {isLoading ? 'Uploading...' : 'Analyze ATS'}
              </button>
              <XIcon className="absolute right-4 top-4 size-5 cursor-pointer text-slate-400 transition hover:text-slate-700" onClick={() => { setShowUploadATS(false); setTitle(''); setResume(null) }} />
            </div>
          </form>
        )}

        {editResumeId && (
          <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-900">Edit resume title</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="mt-4 w-full" required />
              <button className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Update</button>
              <XIcon className="absolute right-4 top-4 size-5 cursor-pointer text-slate-400 transition hover:text-slate-700" onClick={() => { setEditResumeId(''); setTitle('') }} />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard
