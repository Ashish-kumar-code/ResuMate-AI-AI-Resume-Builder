import React from 'react'
import { ArrowUpRight } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <img src="/logo.svg" alt="logo" className="h-10 w-auto" />
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
            A thoughtfully designed space for building resumes that communicate your experience with confidence and clarity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <a href="#features" className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-indigo-300 hover:text-indigo-600">
            Features
          </a>
          <a href="#testimonials" className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-indigo-300 hover:text-indigo-600">
            Testimonials
          </a>
          <a href="/app" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
            Start now <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
