'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/shared/api/client'

interface ConfigData {
  Jwt: {
    Secret: boolean
    SecretLength: number
    Issuer: string
    Audience: string
    AccessTokenExpiration: string
    RefreshTokenExpiration: string
  }
  Frontend: {
    BaseUrl: string
  }
  Request: {
    Scheme: string
    Host: string
    Origin: string
    Referer: string
    UserAgent: string
  }
  Environment: {
    EnvironmentName: string
    IsDevelopment: boolean
  }
}

export default function TestConfigPage() {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConfig = async () => {
      try {
        console.log('🔍 === FRONTEND CONFIG TEST ===')
        console.log(`🔍 JWT_SECRET: ${process.env.NEXT_PUBLIC_JWT_SECRET ? 'SET' : 'NOT SET'}`)
        console.log(`🔍 NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}`)
        console.log(`🔍 NODE_ENV: ${process.env.NODE_ENV}`)
        console.log(`🔍 Current URL: ${window.location.href}`)
        console.log(`🔍 Current origin: ${window.location.origin}`)
        console.log('🔍 === END FRONTEND CONFIG TEST ===')

        const response = await apiClient.get('/api/auth/test-config')
        setConfig(response.data.data)
      } catch (err) {
        console.error('❌ Config test failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testConfig()
  }, [])

  if (loading) return <div className="p-8">Loading configuration test...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!config) return <div className="p-8">No configuration data received</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuration Test</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">JWT Configuration</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Secret configured:{' '}
              <span className={config.Jwt.Secret ? 'text-green-600' : 'text-red-600'}>
                {config.Jwt.Secret ? '✅' : '❌'}
              </span>
            </div>
            <div>
              Secret length: <span className="font-mono">{config.Jwt.SecretLength}</span>
            </div>
            <div>
              Issuer: <span className="font-mono">{config.Jwt.Issuer || 'NOT SET'}</span>
            </div>
            <div>
              Audience: <span className="font-mono">{config.Jwt.Audience || 'NOT SET'}</span>
            </div>
            <div>
              Access Token Expiration:{' '}
              <span className="font-mono">{config.Jwt.AccessTokenExpiration || 'NOT SET'}</span>
            </div>
            <div>
              Refresh Token Expiration:{' '}
              <span className="font-mono">{config.Jwt.RefreshTokenExpiration || 'NOT SET'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Frontend Configuration</h2>
          <div className="text-sm">
            <div>
              Base URL: <span className="font-mono">{config.Frontend.BaseUrl || 'NOT SET'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Request Information</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Scheme: <span className="font-mono">{config.Request.Scheme}</span>
            </div>
            <div>
              Host: <span className="font-mono">{config.Request.Host}</span>
            </div>
            <div>
              Origin: <span className="font-mono">{config.Request.Origin || 'NOT SET'}</span>
            </div>
            <div>
              Referer: <span className="font-mono">{config.Request.Referer || 'NOT SET'}</span>
            </div>
            <div className="col-span-2">
              User Agent: <span className="font-mono text-xs">{config.Request.UserAgent}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment</h2>
          <div className="text-sm">
            <div>
              Environment: <span className="font-mono">{config.Environment.EnvironmentName}</span>
            </div>
            <div>
              Is Development:{' '}
              <span className={config.Environment.IsDevelopment ? 'text-green-600' : 'text-blue-600'}>
                {config.Environment.IsDevelopment ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
