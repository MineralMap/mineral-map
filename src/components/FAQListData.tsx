import React, { useState, useEffect } from 'react'
import { getFAQs, type FAQ } from '../lib/database'

interface FAQListState {
  status: 'loading' | 'success' | 'error'
  faqs: FAQ[]
  error?: string
}

export default function FAQListData() {
  const [state, setState] = useState<FAQListState>({
    status: 'loading',
    faqs: [],
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }))
      const faqs = await getFAQs()
      setState({
        status: 'success',
        faqs,
      })
    } catch (err) {
      setState({
        status: 'error',
        faqs: [],
        error: err instanceof Error ? err.message : 'Failed to load FAQs',
      })
    }
  }

  if (state.status === 'loading') {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="alert alert-error">
            <div>
              <h3 className="font-bold">Unable to load FAQs</h3>
              <div className="text-sm">
                {state.error || 'Please check your internet connection and try again.'}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button onClick={fetchFAQs} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (state.faqs.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="text-center py-20">
            <p className="text-lg text-base-content/70">No frequently asked questions yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-brand">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {state.faqs.map((faq, index) => (
            <div key={faq.id} className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
              <div className="collapse-title text-xl font-medium">{faq.question}</div>
              <div className="collapse-content">
                <div
                  className="pt-2 text-base-content/80 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
