import React from 'react'
import Title from './Title'
import { MessageSquareQuote } from 'lucide-react'

const Testimonial = () => {
  const cardsData = [
    {
      name: 'Mina Patel',
      role: 'Product designer',
      quote: 'The builder helped me turn a rough draft into a polished resume that finally felt true to my experience.',
    },
    {
      name: 'Daniel Ortiz',
      role: 'Operations analyst',
      quote: 'I loved how simple the workflow felt. The ATS suggestions made the final version much stronger.',
    },
    {
      name: 'Alicia Chen',
      role: 'Marketing lead',
      quote: 'It felt more thoughtful than a generic template. The presentation looked sharp and professional right away.',
    },
  ]

  return (
    <section id="testimonials" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <MessageSquareQuote className="size-4" />
            Loved by fast-moving professionals
          </div>
        </div>
        <Title
          title="People trust it because it feels personal"
          description="From first-time users to career switchers, the experience is made to feel calm, focused, and genuinely useful."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cardsData.map((card) => (
            <div key={card.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500">
                {Array(5).fill(0).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-slate-600">“{card.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900">{card.name}</p>
                <p className="text-sm text-slate-500">{card.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonial
