'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomerLogin, useCustomerRegister, useCustomerLogout, useCustomerAuthStore } from '@shared'
import { toast } from 'sonner'
import { User, LogOut } from 'lucide-react'

interface CustomerAuthSectionProps {
  onContinueAsGuest?: () => void
  onAuthenticated?: () => void
}

export function CustomerAuthSection({ onContinueAsGuest, onAuthenticated }: CustomerAuthSectionProps) {
  const { customer, isAuthenticated } = useCustomerAuthStore()
  const loginMutation = useCustomerLogin()
  const registerMutation = useCustomerRegister()
  const logoutMutation = useCustomerLogout()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginMutation.mutateAsync({ email, password })
      toast.success('Logged in successfully!')
      setEmail('')
      setPassword('')
      // Trigger callback to advance to next step
      onAuthenticated?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await registerMutation.mutateAsync({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
      })
      toast.success('Account created successfully!')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setFirstName('')
      setLastName('')
      setPhoneNumber('')
      // Trigger callback to advance to next step
      onAuthenticated?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Auto-advance if already authenticated
  useEffect(() => {
    if (isAuthenticated && customer && onAuthenticated) {
      onAuthenticated()
    }
  }, [isAuthenticated, customer, onAuthenticated])

  if (isAuthenticated && customer) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Welcome back, {customer.firstName} {customer.lastName}!
              </p>
              <p className="text-sm text-gray-600">{customer.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Sign in or create an account (Optional)</h3>
        <p className="text-sm text-gray-600">
          Save your information for faster checkout next time, or{' '}
          <span className="font-medium text-gray-900">continue as guest below</span>
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={isLogin ? 'default' : 'outline'}
          onClick={() => setIsLogin(true)}
          className="flex-1"
          type="button"
        >
          Login
        </Button>
        <Button
          variant={!isLogin ? 'default' : 'outline'}
          onClick={() => setIsLogin(false)}
          className="flex-1"
          type="button"
        >
          Sign Up
        </Button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="register-firstName">First Name</Label>
              <Input
                id="register-firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-lastName">Last Name</Label>
              <Input
                id="register-lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-phone">Phone Number (Optional)</Label>
            <Input
              id="register-phone"
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirm Password</Label>
            <Input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className={
                confirmPassword && password !== confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''
              }
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending || (!!confirmPassword && password !== confirmPassword)}
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      )}

      {/* Guest Checkout Button */}
      <div className="mt-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-2 font-medium">Or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={onContinueAsGuest}>
          Continue as Guest
        </Button>
        <p className="text-xs text-center text-gray-500 mt-3">
          You can complete your order without creating an account
        </p>
      </div>
    </div>
  )
}
