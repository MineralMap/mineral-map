import React, { useState, useEffect } from 'react'
import { getMineralBySlug, getMineralsByCategory, type Mineral } from '../lib/database'

interface MineralDetailProps {
  slug: string
}

interface MineralDetailState {
  status: 'loading' | 'success' | 'error' | 'not-found'
  mineral: Mineral | null
  relatedMinerals: Mineral[]
  error?: string
}

export default function MineralDetailData({ slug }: MineralDetailProps) {
  const [state, setState] = useState<MineralDetailState>({
    status: 'loading',
    mineral: null,
    relatedMinerals: [],
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
          relatedMinerals: [],
        })
      } else {
        // Fetch related minerals if category exists
        let relatedMinerals: Mineral[] = []
        if (mineral.category) {
          try {
            relatedMinerals = await getMineralsByCategory(mineral.category, 4, mineral.id)
          } catch (err) {
            console.error('Error fetching related minerals:', err)
          }
        }

        setState({
          status: 'success',
          mineral,
          relatedMinerals,
        })
      }
    } catch (err) {
      setState({
        status: 'error',
        mineral: null,
        relatedMinerals: [],
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

  const { mineral, relatedMinerals } = state

  if (!mineral) {
    return null
  }

  // Get images array, ensure it's an array
  const images = Array.isArray(mineral.images) ? mineral.images : []
  const hasImages = images.length > 0
  const hasVideo = mineral.video_url && mineral.video_url.trim() !== ''

  return (
    <>
      <section className="section-padding">
        <div className="container-brand">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <a href="/minerals" className="btn btn-ghost btn-sm">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Minerals
              </a>
            </div>

            {/* Mineral Header */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                <i className="fas fa-gem mr-2 md:mr-3"></i>
                {mineral.title}
              </h1>
              {mineral.category && (
                <div className="flex justify-center gap-2 mt-4">
                  <span className="badge badge-primary badge-lg">
                    <i className="fas fa-tag mr-2"></i>
                    {mineral.category}
                  </span>
                  {mineral.featured && (
                    <span className="badge badge-secondary badge-lg">
                      <i className="fas fa-star mr-2"></i>
                      Featured
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {/* Left Column - Media */}
              <div className="space-y-6">
                {/* Image Gallery */}
                {hasImages && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title text-xl mb-4">
                        <i className="fas fa-images mr-2"></i>
                        Gallery
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {images.map((image: any, index: number) => {
                          const imageUrl = typeof image === 'string' ? image : image.url || image.src
                          return (
                            <div
                              key={index}
                              className="cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity aspect-square"
                              onClick={() => setSelectedImage(imageUrl)}
                            >
                              <img
                                src={imageUrl}
                                alt={`${mineral.title} - Image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-sm text-base-content/60 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Click any image to view full size
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Section */}
                {hasVideo && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title text-xl mb-4">
                        <i className="fas fa-play-circle mr-2"></i>
                        Video Presentation
                      </h2>
                      <video controls className="w-full rounded-lg">
                        <source src={mineral.video_url!} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Placeholder if no media */}
                {!hasImages && !hasVideo && (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
                        <i className="fas fa-image text-6xl mb-4"></i>
                        <p className="text-lg">No images or videos available yet</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Information */}
              <div className="space-y-6">
                {/* About Section */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                      <i className="fas fa-info-circle mr-2"></i>
                      About {mineral.title}
                    </h2>
                    <div
                      className="text-base-content/80 leading-relaxed prose prose-lg max-w-none"
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
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span className="font-medium flex items-center">
                          <i className="fas fa-tag mr-2 text-primary"></i>
                          Classification
                        </span>
                        <div className="text-right">
                          {mineral.category ? (
                            <span className="badge badge-primary">{mineral.category}</span>
                          ) : (
                            <span className="text-base-content/60">Not specified</span>
                          )}
                        </div>
                      </div>
                      {mineral.color && (
                        <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                          <span className="font-medium flex items-center">
                            <i className="fas fa-palette mr-2 text-primary"></i>
                            Color
                          </span>
                          <span className="badge badge-outline">{mineral.color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Minerals Section */}
            {relatedMinerals.length > 0 && (
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    <i className="fas fa-link mr-2 text-primary"></i>
                    Related Minerals
                  </h2>
                  <p className="text-base-content/70">
                    Explore more minerals from the {mineral.category} category
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedMinerals.map((relatedMineral) => {
                    const relatedImage =
                      Array.isArray(relatedMineral.images) && relatedMineral.images.length > 0
                        ? typeof relatedMineral.images[0] === 'string'
                          ? relatedMineral.images[0]
                          : relatedMineral.images[0].url || relatedMineral.images[0].src
                        : null

                    return (
                      <div
                        key={relatedMineral.id}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {relatedImage && (
                          <figure className="px-4 pt-4">
                            <img
                              src={relatedImage}
                              alt={relatedMineral.title}
                              className="rounded-xl object-cover h-40 w-full"
                            />
                          </figure>
                        )}
                        <div className="card-body">
                          <h3 className="card-title text-lg">
                            <i className="fas fa-gem text-primary mr-2"></i>
                            {relatedMineral.title}
                          </h3>
                          {relatedMineral.description && (
                            <div
                              className="text-base-content/70 text-sm line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: relatedMineral.description.substring(0, 100) + '...',
                              }}
                            />
                          )}
                          <div className="card-actions justify-end mt-4">
                            <a
                              href={`/mineral/${relatedMineral.slug}`}
                              className="btn btn-primary btn-sm"
                            >
                              Learn More
                              <i className="fas fa-chevron-right ml-1"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="modal modal-open"
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-box max-w-5xl p-0 relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-base-100/80"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <figure>
              <img
                src={selectedImage}
                alt={mineral.title}
                className="w-full h-auto"
              />
            </figure>
          </div>
        </div>
      )}
    </>
  )
}
