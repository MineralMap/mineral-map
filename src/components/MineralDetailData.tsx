import React, { useState, useEffect } from 'react'
import { getMineralBySlug, type Mineral } from '../lib/database'

interface MineralDetailProps {
  slug: string
}

interface MineralDetailState {
  status: 'loading' | 'success' | 'error' | 'not-found'
  mineral: Mineral | null
  error?: string
}

export default function MineralDetailData({ slug }: MineralDetailProps) {
  const [state, setState] = useState<MineralDetailState>({
    status: 'loading',
    mineral: null,
  })

  useEffect(() => {
    if (slug) {
      fetchMineral()
    }
  }, [slug])

  const fetchMineral = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }))
      const mineral = await getMineralBySlug(slug)

      if (!mineral) {
        setState({
          status: 'not-found',
          mineral: null,
        })
      } else {
        setState({
          status: 'success',
          mineral,
        })
      }
    } catch (err) {
      setState({
        status: 'error',
        mineral: null,
        error: err instanceof Error ? err.message : 'Failed to load mineral',
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

  if (state.status === 'not-found') {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <div className="max-w-4xl mx-auto text-center">
            <div className="alert alert-warning">
              <div>
                <h3 className="font-bold">Mineral not found</h3>
                <div className="text-sm">
                  This mineral may have been removed or the link is incorrect.
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a href="/minerals" className="btn btn-primary">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Minerals
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="section-padding">
        <div className="container-brand">
          <div className="max-w-4xl mx-auto">
            <div className="alert alert-error">
              <div>
                <h3 className="font-bold">Unable to load mineral</h3>
                <div className="text-sm">
                  {state.error || 'Something went wrong while loading this page. Please try again later.'}
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button onClick={fetchMineral} className="btn btn-primary mr-2">
                Retry
              </button>
              <a href="/minerals" className="btn btn-ghost">
                Back to Minerals
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { mineral } = state

  if (!mineral) {
    return null
  }

  return (
    <section className="section-padding">
      <div className="container-brand">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <a href="/minerals" className="btn btn-ghost btn-sm">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Minerals
            </a>
          </div>

          {/* Mineral Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              <i className="fas fa-gem mr-2 md:mr-3"></i>
              {mineral.title}
            </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Video Section */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    <i className="fas fa-play-circle mr-2"></i>
                    Video Presentation
                  </h2>
                  <video controls poster="/placeholder.jpg" className="w-full rounded-lg">
                    <source src="/videos/test.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    <i className="fas fa-info-circle mr-2"></i>
                    About {mineral.title}
                  </h2>
                  <div
                    className="text-base-content/80 leading-relaxed text-lg prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: mineral.description || 'No description available' }}
                  />
                </div>
              </div>

              {/* Properties Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    <i className="fas fa-list mr-2"></i>
                    Properties
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">Classification:</span>
                      <div className="text-right">
                        {mineral.category ? (
                          <span className="badge badge-outline badge-sm">{mineral.category}</span>
                        ) : (
                          <span className="text-base-content/60">Not specified</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`badge ${
                          mineral.status === 'published'
                            ? 'badge-success'
                            : mineral.status === 'draft'
                              ? 'badge-warning'
                              : mineral.status === 'archived'
                                ? 'badge-error'
                                : 'badge-neutral'
                        }`}
                      >
                        {mineral.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
