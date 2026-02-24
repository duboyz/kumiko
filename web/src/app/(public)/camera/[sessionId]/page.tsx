'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Upload, Check } from 'lucide-react'

const DEFAULT_API_URL = 'http://localhost:5158'

export default function CameraPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_URL)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Read ?api= from URL on the client only (avoids useSearchParams which can hang on mobile)
  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const api = params.get('api')
    if (api) setApiBaseUrl(api)
    else if (process.env.NEXT_PUBLIC_API_URL) setApiBaseUrl(process.env.NEXT_PUBLIC_API_URL)
  }, [])

  const API_BASE_URL = apiBaseUrl

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      setCapturedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    if (e.target) e.target.value = ''
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    if (e.target) e.target.value = ''
  }

  const handleUpload = async () => {
    if (!capturedImage || !sessionId) return

    setIsUploading(true)
    setUploadSuccess(false)

    try {
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append('image', blob, 'camera-image.jpg')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20_000)

      const uploadUrl = `${API_BASE_URL}/api/camera-session/${sessionId}/upload`
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!uploadRes.ok) {
        const text = await uploadRes.text()
        console.error('Upload failed', uploadRes.status, text)
        throw new Error(uploadRes.status === 404 ? 'Session expired' : `Upload failed (${uploadRes.status})`)
      }

      setUploadSuccess(true)
      setUploadCount(c => c + 1)
    } catch (error: unknown) {
      console.error('Upload failed:', error)
      const msg = error instanceof Error ? error.message : String(error)
      const isAborted = error instanceof Error && error.name === 'AbortError'
      const isNetwork =
        msg.includes('Network') ||
        msg.includes('CORS') ||
        msg.includes('Failed to fetch') ||
        msg.includes('Load failed')
      const isSessionExpired = msg.includes('Session expired')
      const errorDetails = `Tried: ${API_BASE_URL}/api/camera-session/${sessionId}/upload`
      alert(
        isAborted
          ? `Request timed out after 20s.\n\n${errorDetails}\n\nCheck:\n- Backend is running at ${API_BASE_URL}\n- Phone and computer on same Wi‑Fi\n- Backend allows connections from phone (run with --urls "http://0.0.0.0:5158")`
          : isSessionExpired
            ? 'Session expired. Close this page and scan the QR code again from your computer.'
            : isNetwork
              ? `Cannot reach server.\n\n${errorDetails}\n\nCheck:\n- Backend is running at ${API_BASE_URL}\n- Phone and computer on same Wi‑Fi\n- Backend allows connections from phone (run with --urls "http://0.0.0.0:5158")`
              : `Failed to upload image.\n\n${errorDetails}\n\nPlease try again.`
      )
    } finally {
      setIsUploading(false)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setUploadSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Take Menu Photo</CardTitle>
          <CardDescription>Capture or upload a menu image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!capturedImage ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleCameraClick}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                >
                  <Camera className="w-6 h-6" />
                  <span>Camera</span>
                </Button>
                <Button
                  onClick={handleFileInputClick}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              </div>
              {uploadSuccess ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2 text-green-600">
                    <Check className="w-8 h-8" />
                    <span className="font-medium">Uploaded!</span>
                    {uploadCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {uploadCount} photo{uploadCount !== 1 ? 's' : ''} sent to your computer
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={resetCapture} className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Take another photo
                    </Button>
                    <Button variant="outline" onClick={resetCapture} className="w-full">
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button onClick={resetCapture} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraInputChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  )
}
