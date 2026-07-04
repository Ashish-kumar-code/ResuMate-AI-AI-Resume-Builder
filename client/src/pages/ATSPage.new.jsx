import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../configs/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ScanSearch, Sparkles } from 'lucide-react'

const ATSPage = () => {
  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const analyzeATS = async () => {
    if (!jobDescription.trim()) {
      return toast.error('Please paste a job description')
    }

    try {
      setLoading(true)
      const { data } = await api.post('/api/ai/ats-score', { resumeId, jobDescription }, { headers: { Authorization: token } })
      setResult(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_25%),linear-gradient(135deg,_#f8fbff_0%,_#f5f7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">ATS analysis</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tailor your resume to the role you want.</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Paste the job description, and we’ll surface the keywords your resume currently covers and the ones it still needs.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles className="size-4" /> Smart keyword matching
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <label className="text-sm font-semibold text-slate-700">Job description</label>
            <textarea rows={12} placeholder="Paste the target job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="mt-3 min-h-64 w-full" />
            <button onClick={analyzeATS} disabled={loading} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
              <ScanSearch className="size-4" /> {loading ? 'Analyzing...' : 'Analyze resume'}
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Preview</p>
            <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-400">ATS score</p>
              <p className="mt-1 text-4xl font-semibold">{result?.atsScore ?? 0}%</p>
              <p className="mt-2 text-sm text-slate-300">A stronger score means the resume aligns better with the role’s language and expectations.</p>
            </div>
            {result && (
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Matched keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.matchedKeywords?.map((word, idx) => (
                      <span key={idx} className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">{word}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Missing keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.missingKeywords?.map((word, idx) => (
                      <span key={idx} className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-200">{word}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATSPage
