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
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Website Name/Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors">
              {websiteName}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {pages.map(page => {
              const isActive =
                currentPageSlug === page.slug ||
                (page.slug === 'home' && !currentPageSlug) ||
                (page.slug === 'home' && currentPageSlug === '')

              return (
                <Link
                  key={page.id}
                  href={page.slug === 'home' ? '/' : `/${page.slug}`}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary border-b border-primary pb-1'
                      : 'text-muted-foreground hover:text-foreground'
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
              className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="py-2 space-y-1">
            {pages.map(page => {
              const isActive =
                currentPageSlug === page.slug ||
                (page.slug === 'home' && !currentPageSlug) ||
                (page.slug === 'home' && currentPageSlug === '')

              return (
                <Link
                  key={page.id}
                  href={page.slug === 'home' ? '/' : `/${page.slug}`}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
