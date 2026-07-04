import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section id="cta" className="px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-10 text-white shadow-sm sm:px-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-200">Ready when you are</p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">Open a new chapter with a resume that feels intentional and current.</h3>
            <p className="mt-3 text-base leading-7 text-slate-300">Start from a clean workspace, write with confidence, and leave with a version that genuinely reflects your work.</p>
          </div>
          <Link to="/app" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Start building <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
