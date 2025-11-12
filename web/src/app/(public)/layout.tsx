'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useCurrentUser } from '@shared/hooks'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOnLandingPage, setIsOnLandingPage] = useState(false)
  const { data: currentUser, isLoading } = useCurrentUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const checkLandingPage = () => {
      setIsOnLandingPage(window.location.pathname === '/')
    }

    checkLandingPage()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isOnLandingPage && !isScrolled
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span
                className={`font-bold text-xl transition-colors duration-300 ${isOnLandingPage && !isScrolled ? 'text-white' : 'text-gray-900'
                  }`}
              >
                Kumiko
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors duration-300 hover:text-gray-600 ${isOnLandingPage && !isScrolled ? 'text-white/90' : 'text-gray-700'
                  }`}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-colors duration-300 hover:text-gray-600 ${isOnLandingPage && !isScrolled ? 'text-white/90' : 'text-gray-700'
                  }`}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors duration-300 hover:text-gray-600 ${isOnLandingPage && !isScrolled ? 'text-white/90' : 'text-gray-700'
                  }`}
              >
                Contact
              </Link>
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {!isLoading && currentUser ? (
                <Link href="/dashboard">
                  <Button
                    className={`text-sm font-medium transition-all duration-300 ${isOnLandingPage && !isScrolled
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : !isLoading ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium transition-colors duration-300 ${isOnLandingPage && !isScrolled
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className={`text-sm font-medium transition-all duration-300 ${isOnLandingPage && !isScrolled
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${isOnLandingPage && !isScrolled ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/about"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  {currentUser ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full text-sm font-medium bg-black text-white hover:bg-gray-800">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full text-sm font-medium bg-black text-white hover:bg-gray-800">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 pt-20">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">© 2024 Kumiko. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
