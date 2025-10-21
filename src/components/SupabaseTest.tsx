import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ConnectionStatus {
  status: 'testing' | 'success' | 'error'
  message: string
  data?: any
  mineralsTest?: {
    status: 'testing' | 'success' | 'error'
    message: string
    count?: number
  }
}

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'testing',
    message: 'Testing connection...'
  })

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testMineralsTable = async () => {
    try {
      setConnectionStatus(prev => ({
        ...prev,
        mineralsTest: { status: 'testing', message: 'Testing minerals table...' }
      }))

      const { data, error, count } = await supabase
        .from('minerals')
        .select('title, description, status, category', { count: 'exact' })
        .limit(5)

      if (error) {
        setConnectionStatus(prev => ({
          ...prev,
          mineralsTest: {
            status: 'error',
            message: `Minerals table error: ${error.message}`
          }
        }))
      } else {
        setConnectionStatus(prev => ({
          ...prev,
          mineralsTest: {
            status: 'success',
            message: `✅ Found ${count || 0} minerals in database`,
            count: count || 0
          }
        }))
      }
    } catch (err) {
      setConnectionStatus(prev => ({
        ...prev,
        mineralsTest: {
          status: 'error',
          message: `Minerals table error: ${err instanceof Error ? err.message : 'Unknown error'}`
        }
      }))
    }
  }

  const testSupabaseConnection = async () => {
    try {
      // Test the connection by checking if we can access the auth endpoint
      // This is the most reliable way to test a Supabase connection
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        // If auth fails, try to access the database directly
        // This will work even if no tables exist yet
        const { data: dbData, error: dbError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1)

        if (dbError) {
          // Last resort: try to access the public schema
          const { error: schemaError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .limit(1)

          if (schemaError) {
            setConnectionStatus({
              status: 'error',
              message: `Connection failed: ${schemaError.message}`
            })
          } else {
            setConnectionStatus({
              status: 'success',
              message: '✅ Supabase connection successful!'
            })
          }
        } else {
          setConnectionStatus({
            status: 'success',
            message: '✅ Supabase connection successful!',
            data: dbData
          })
          // Test minerals table after successful connection
          testMineralsTable()
        }
      } else {
        setConnectionStatus({
          status: 'success',
          message: '✅ Supabase connection successful!',
          data: data
        })
        // Test minerals table after successful connection
        testMineralsTable()
      }
    } catch (err) {
      setConnectionStatus({
        status: 'error',
        message: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      })
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return '⏳'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title">
          <span className="text-2xl">{getStatusIcon()}</span>
          Supabase Connection Test
        </h2>
        
        <div className={`text-lg font-medium ${getStatusColor()}`}>
          {connectionStatus.message}
        </div>

        {connectionStatus.status === 'testing' && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        {connectionStatus.status === 'error' && (
          <div className="alert alert-error mt-4">
            <div>
              <h3 className="font-bold">Connection Error</h3>
              <div className="text-xs">Check your .env file and Supabase credentials</div>
            </div>
          </div>
        )}

        {connectionStatus.status === 'success' && (
          <div className="alert alert-success mt-4">
            <div>
              <h3 className="font-bold">Connection Successful!</h3>
              <div className="text-xs">Your Supabase connection is working properly</div>
            </div>
          </div>
        )}

        {/* Minerals Table Test Results */}
        {connectionStatus.mineralsTest && (
          <div className="mt-4">
            <div className="divider text-sm">Minerals Table Test</div>
            <div className={`text-sm font-medium ${
              connectionStatus.mineralsTest.status === 'success' ? 'text-green-600' :
              connectionStatus.mineralsTest.status === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {connectionStatus.mineralsTest.status === 'testing' && (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              )}
              {connectionStatus.mineralsTest.message}
            </div>
            
            {connectionStatus.mineralsTest.status === 'error' && (
              <div className="alert alert-error mt-2">
                <div>
                  <h4 className="font-bold">Table Access Error</h4>
                  <div className="text-xs">Check if your 'minerals' table exists and has 'title' and 'description' columns</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card-actions justify-end">
          <button 
            className="btn btn-outline btn-sm"
            onClick={testSupabaseConnection}
            disabled={connectionStatus.status === 'testing'}
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  )
}
