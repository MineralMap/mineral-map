import React, { useState, useEffect } from 'react'
import { getMineralsCount, getRecentMinerals, type Mineral } from '../lib/database'

interface HomePageState {
  status: 'loading' | 'success' | 'error'
  mineralsCount: number
  recentMinerals: Mineral[]
  error?: string
}

export default function HomePageData() {
  const [state, setState] = useState<HomePageState>({
    status: 'loading',
    mineralsCount: 0,
    recentMinerals: [],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }))

      // Fetch both mineral count and recent minerals concurrently
      const [count, recent] = await Promise.all([
        getMineralsCount(),
        getRecentMinerals(3),
      ])

      setState({
        status: 'success',
        mineralsCount: count,
        recentMinerals: recent,
      })
    } catch (err) {
      setState({
        status: 'error',
        mineralsCount: 0,
        recentMinerals: [],
        error: err instanceof Error ? err.message : 'Failed to load data',
      })
    }
  }

  if (state.status === 'loading') {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="section-padding">
        <div className="container-brand">
          <div className="alert alert-error">
            <div>
              <h3 className="font-bold">Unable to load data</h3>
              <div className="text-sm">
                {state.error || 'Please check your internet connection and try again.'}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button onClick={fetchData} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Stats Section */}
      <section className="section-padding bg-base-200">
        <div className="container-brand">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat text-center">
              <div className="stat-title">Minerals</div>
              <div className="stat-value text-primary">{state.mineralsCount}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Minerals */}
      <section className="section-padding">
        <div className="container-brand">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Minerals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.recentMinerals.map((mineral) => (
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
          <div className="text-center mt-12">
            <a href="/minerals" className="btn btn-outline btn-primary">
              View All Minerals
              <i className="fas fa-chevron-right ml-1"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
