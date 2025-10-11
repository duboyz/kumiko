'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface OnboardingErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface OnboardingErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

export class OnboardingErrorBoundary extends React.Component<
  OnboardingErrorBoundaryProps,
  OnboardingErrorBoundaryState
> {
  constructor(props: OnboardingErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): OnboardingErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Onboarding Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-red-600">
                  We encountered an unexpected error during the onboarding process. This might be due to a network issue
                  or a temporary problem.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {this.state.error?.message || 'Unknown error occurred'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={this.handleReset} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>

                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer hover:text-foreground">Technical Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{this.state.error?.stack}</pre>
                </details>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
