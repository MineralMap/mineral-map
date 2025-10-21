import React, { useState, useEffect } from 'react'
import { getMinerals, type Mineral } from '../lib/database'

interface MineralsListState {
  status: 'loading' | 'success' | 'error'
  minerals: Mineral[]
  error?: string
}

export default function MineralsListData() {
  const [state, setState] = useState<MineralsListState>({
    status: 'loading',
    minerals: [],
  })

  useEffect(() => {
    fetchMinerals()
  }, [])

  const fetchMinerals = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }))
      const minerals = await getMinerals()
      setState({
        status: 'success',
        minerals,
      })
    } catch (err) {
      setState({
        status: 'error',
        minerals: [],
        error: err instanceof Error ? err.message : 'Failed to load minerals',
      })
    }
  }

  if (state.status === 'loading') {
    return (
      <section className="section-padding">
        <div className="container-brand">
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
          <div className="alert alert-error">
            <div>
              <h3 className="font-bold">Unable to load minerals</h3>
              <div className="text-sm">
                {state.error || 'Please check your internet connection and try again.'}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button onClick={fetchMinerals} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (state.minerals.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center py-20">
            <p className="text-lg text-base-content/70">No minerals available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-brand">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.minerals.map((mineral) => (
            <div
              key={mineral.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-body">
                <h2 className="card-title text-primary text-xl">
                  <i className="fas fa-gem text-primary mr-2"></i>
                  {mineral.title}
                  <div className="badge badge-secondary badge-sm">Mineral</div>
                </h2>
                <div
                  className="text-base-content/80 leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: mineral.description || 'No description available' }}
                />
                <div className="card-actions justify-end mt-6">
                  <a
                    href={`/mineral/${mineral.slug}`}
                    className="btn btn-primary btn-sm hover:btn-primary-focus"
                  >
                    Learn More
                    <i className="fas fa-chevron-right ml-1"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
