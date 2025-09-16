'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface PublicWebsiteHeaderProps {
  websiteName: string
  pages: Array<{
    id: string
    title: string
    slug: string
  }>
  currentPageSlug?: string
}

export function PublicWebsiteHeader({ websiteName, pages, currentPageSlug }: PublicWebsiteHeaderProps) {
  const params = useParams()
  const subdomain = params.subdomain as string

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Website Name/Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              {websiteName}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {pages.map((page) => {
              const isActive = currentPageSlug === page.slug ||
                               (page.slug === 'home' && !currentPageSlug) ||
                               (page.slug === 'home' && currentPageSlug === '')

              return (
                <Link
                  key={page.id}
                  href={page.slug === 'home' ? '/' : `/${page.slug}`}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {page.title}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="py-2 space-y-1">
            {pages.map((page) => {
              const isActive = currentPageSlug === page.slug ||
                               (page.slug === 'home' && !currentPageSlug) ||
                               (page.slug === 'home' && currentPageSlug === '')

              return (
                <Link
                  key={page.id}
                  href={page.slug === 'home' ? '/' : `/${page.slug}`}
                  className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {page.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}