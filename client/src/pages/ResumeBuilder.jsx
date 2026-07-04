import React, { useEffect, useState, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
const ResumePreview = React.lazy(() => import('../components/ResumePreview'))
const TemplateSelector = React.lazy(() => import('../components/TemplateSelector'))
const ColorPicker = React.lazy(() => import('../components/ColorPicker'))
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }))

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      console.error('Error saving resume:', error)
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = () => {
    window.print()
  }

  const saveResume = async () => {
    try {
      const updatedResumeData = structuredClone(resumeData)

      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground', 'yes')
      typeof resumeData.personal_info.image === 'object' && formData.append('image', resumeData.personal_info.image)

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      setResumeData(data.resume)
      toast.success(data.message)
    } catch (error) {
      console.error('Error saving resume:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.12),_transparent_25%),linear-gradient(135deg,_#f8fbff_0%,_#f5f7ff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to={'/app'} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
          <ArrowLeftIcon className="size-4" /> Back to dashboard
        </Link>

        <div className="mt-4 rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Resume builder</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">{resumeData.title || 'Your draft'}</h1>
              <p className="mt-1 text-sm text-slate-500">Shape the content on the left and review the polished layout on the right.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.public && (
                <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
                  <Share2Icon className="size-4" /> Share
                </button>
              )}
              <button onClick={changeResumeVisibility} className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100">
                {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                {resumeData.public ? 'Public' : 'Private'}
              </button>
              <button onClick={downloadResume} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
                <DownloadIcon className="size-4" /> Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5 lg:p-6">
            <div className="relative mb-6 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Suspense fallback={<div className="h-8 w-28" />}>{/* Template selector */}
                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData((prev) => ({ ...prev, template }))} />
                  </Suspense>
                  <Suspense fallback={<div className="h-8 w-10" />}>{/* Color picker */}
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))} />
                  </Suspense>
                </div>
                <div className="text-sm text-slate-500">Step {activeSectionIndex + 1} of {sections.length}</div>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" style={{ width: `${(activeSectionIndex / (sections.length - 1)) * 100}%` }} />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                {React.createElement(activeSection.icon, { className: 'size-4 text-indigo-500' })}
                {activeSection.name}
              </div>
              <div className="flex items-center gap-1">
                {activeSectionIndex !== 0 && (
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50" disabled={activeSectionIndex === 0}>
                    <ChevronLeft className="size-4" /> Prev
                  </button>
                )}
                <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {activeSection.id === 'personal' && <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />}
              {activeSection.id === 'summary' && <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />}
              {activeSection.id === 'experience' && <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))} />}
              {activeSection.id === 'education' && <EducationForm data={resumeData.education} onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))} />}
              {activeSection.id === 'projects' && <ProjectForm data={resumeData.project} onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))} />}
              {activeSection.id === 'skills' && <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))} />}
            </div>

            <button onClick={() => { toast.promise(saveResume, { loading: 'Saving...', success: 'Saved successfully', error: 'Could not save' }) }} className="mt-6 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
              Save changes
            </button>
          </div>

          <div className="lg:col-span-7">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading preview…</div>}>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
