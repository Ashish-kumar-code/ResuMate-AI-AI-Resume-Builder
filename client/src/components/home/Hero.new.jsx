import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react'

const Hero = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.2),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">RA</div>
            <div>
              <p className="text-base font-semibold">ResuMate AI</p>
              <p className="text-xs text-slate-500">Craft, refine, and ship</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#testimonials" className="transition hover:text-slate-900">Stories</a>
            <a href="#cta" className="transition hover:text-slate-900">Get started</a>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/app" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Open dashboard</Link>
            ) : (
              <>
                <Link to="/app?state=login" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Log in</Link>
                <Link to="/app?state=register" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Create account</Link>
              </>
            )}
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              <Sparkles className="size-4" /> AI-assisted resume building
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn your experience into a resume that feels as sharp as your next opportunity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Build a polished, recruiter-ready resume in minutes. Refine your story, improve ATS alignment, and publish a professional version with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/app" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Build my resume <ArrowRight className="size-4" />
              </Link>
              <Link to="/app" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Try ATS insights
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2">
                <ShieldCheck className="size-4 text-emerald-600" /> Tailored for modern roles
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2">
                <TrendingUp className="size-4 text-indigo-600" /> Stronger keyword alignment
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] sm:p-6">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Resume preview</p>
                  <p className="text-sm text-slate-500">A cleaner experience for your next chapter</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Live</div>
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Ava Carter</p>
                    <p className="text-sm text-slate-500">Product Designer • 8+ years</p>
                  </div>
                  <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">Senior</div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">Leadership impact</p>
                    <p className="mt-1 text-sm text-slate-600">Led cross-functional design systems for growth-stage teams.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">ATS focus</p>
                    <p className="mt-1 text-sm text-slate-600">Reinforced role-specific keywords and measurable outcomes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
