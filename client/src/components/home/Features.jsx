import React from 'react'
import { Sparkles, FileCheck2, ScanSearch, Wand2 } from 'lucide-react'
import Title from './Title'

const Features = () => {
  const cards = [
    {
      icon: Wand2,
      title: 'AI-assisted writing',
      text: 'Refine bullet points, tighten summaries, and add stronger action verbs with one click.',
      tint: 'from-violet-500/15 to-violet-500/5',
    },
    {
      icon: ScanSearch,
      title: 'ATS score insights',
      text: 'Compare your resume against a target role and surface the missing keywords that matter.',
      tint: 'from-emerald-500/15 to-emerald-500/5',
    },
    {
      icon: FileCheck2,
      title: 'Export-ready presentation',
      text: 'Share polished, professional versions that feel custom rather than generic.',
      tint: 'from-sky-500/15 to-sky-500/5',
    },
  ]

  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Sparkles className="size-4" />
            Built to feel effortless
          </div>
        </div>
        <Title
          title="A sharper way to build resumes"
          description="Everything is arranged around clarity and momentum, so you can move from first draft to polished application without friction."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Why it works</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Less formatting stress. More focus on your story.</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              The builder keeps your content front and center while giving you smart prompts, structured sections, and a workflow that feels premium from the first draft.
            </p>
            <div className="mt-8 space-y-3">
              {cards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-r ${card.tint} p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-white p-2 shadow-sm">
                        <Icon className="size-5 text-slate-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{card.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{card.text}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Live preview</p>
                <h3 className="mt-2 text-2xl font-semibold">Your next move is clear.</h3>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Ready</div>
            </div>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Core summary</p>
                  <p className="mt-1 text-xl font-semibold">Product-focused and impact-led</p>
                </div>
                <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-200">Tailored</div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-2 w-3/4 rounded-full bg-white/70" />
                <div className="h-2 w-2/3 rounded-full bg-white/50" />
                <div className="h-2 w-5/6 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
