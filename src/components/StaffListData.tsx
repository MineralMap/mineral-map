import React, { useState, useEffect } from 'react'
import { getStaff, type Staff } from '../lib/database'

interface StaffListState {
  status: 'loading' | 'success' | 'error'
  staff: Staff[]
  error?: string
}

export default function StaffListData() {
  const [state, setState] = useState<StaffListState>({
    status: 'loading',
    staff: [],
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setState((prev) => ({ ...prev, status: 'loading' }))
      const staff = await getStaff()
      setState({
        status: 'success',
        staff,
      })
    } catch (err) {
      setState({
        status: 'error',
        staff: [],
        error: err instanceof Error ? err.message : 'Failed to load staff',
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
      <div>
        <div className="alert alert-error">
          <div>
            <h3 className="font-bold">Unable to load staff</h3>
            <div className="text-sm">
              {state.error || 'Please check your internet connection and try again.'}
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button onClick={fetchStaff} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (state.staff.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-base-content/70">No staff members listed yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {state.staff.map((member) => (
        <div key={member.id} className="card bg-base-100 shadow-xl">
          <figure className="p-10">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={member.image || '/apple-touch-icon.png'} alt={member.title} />
              </div>
            </div>
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="card-title">{member.title}</h3>
            <div
              className="text-base-content/70 max-h-40 overflow-y-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: member.description || '' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
