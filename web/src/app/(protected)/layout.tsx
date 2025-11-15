'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Toaster } from 'sonner'
import { LocationOption, useLocationSelection, useLogout } from '@shared'
import { LoadingSpinner } from '@/components'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'
import {
  LayoutDashboard,
  Globe,
  Settings,
  Menu as MenuIcon,
  Hotel,
  ForkKnifeCrossed,
  ShoppingCart,
  LogOut,
  Menu,
} from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const router = useRouter()
  const signOut = useLogout()
  const pathSegments = pathname.split('/').filter(Boolean)
  const { isLoading, hasNoLocations, selectedLocation } = useLocationSelection()
  const selectedLocationType = selectedLocation?.type || 'Restaurant'
  const logoutMutation = useLogout()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = useMemo(() => {
    const links = [
      {
        label: t('dashboard'),
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ]

    if (selectedLocationType === 'Restaurant') {
      links.push(
        ...[
          {
            label: t('menus'),
            href: '/menus',
            icon: MenuIcon,
          },
          {
            label: t('orders'),
            href: '/orders',
            icon: ShoppingCart,
          },
        ]
      )
    }

    links.push(
      ...[
        {
          label: t('websites'),
          href: '/websites',
          icon: Globe,
        },
        {
          label: t('settings'),
          href: '/settings',
          icon: Settings,
        },
      ]
    )

    return links
  }, [selectedLocationType, t])

  // Check if current path matches or starts with the link href
  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Redirect to onboarding if user has no locations (except if already on onboarding)
  useEffect(() => {
    if (!isLoading && hasNoLocations && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding')
    }
  }, [hasNoLocations, isLoading, pathname, router])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Show loading while checking locations
  if (isLoading && !pathname.startsWith('/onboarding')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  const websitePattern = /\/websites\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
  const isWebsitePage = websitePattern.test(pathname)
  const isOnboardingPage = pathname.startsWith('/onboarding')
  const isNewMenuPage = pathname.startsWith('/new-menu')

  if (isWebsitePage || isOnboardingPage || isNewMenuPage) return children

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex flex-shrink-0 w-72 bg-white border-r border-gray-200 flex-col">
        <SidebarContent
          links={links}
          isActiveLink={isActiveLink}
          logoutMutation={logoutMutation}
        />
      </aside>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t('navigationMenu')}</SheetTitle>
          </SheetHeader>
          <SidebarContent
            links={links}
            isActiveLink={isActiveLink}
            logoutMutation={logoutMutation}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={t('openMenu')}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center">
            <span className="font-semibold text-gray-900">
              {selectedLocation?.name}
            </span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="h-full">{children}</div>
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}

// Sidebar Content Component (used for both desktop and mobile)
function SidebarContent({
  links,
  isActiveLink,
  logoutMutation,
}: {
  links: Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>
  isActiveLink: (href: string) => boolean
  logoutMutation: ReturnType<typeof useLogout>
}) {
  const t = useTranslations('navigation')

  return (
    <>
      {/* Location Selector Section */}
      <div className="p-6 border-b border-gray-200">
        <LocationSelector />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {links.map(link => {
            const Icon = link.icon
            const isActive = isActiveLink(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}
                />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section - Logout Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span>{logoutMutation.isPending ? t('loggingOut') : t('logout')}</span>
        </button>
      </div>
    </>
  )
}

export function LocationSelector() {
  const t = useTranslations('navigation')
  const { selectedLocation, userLocations, isLoading, hasNoLocations, setSelectedLocation } = useLocationSelection()
  const [isOpen, setIsOpen] = useState(false)
  const locationType = selectedLocation?.type || 'Restaurant'
  const locationIcon =
    locationType === 'Restaurant' ? <ForkKnifeCrossed className="h-4 w-4" /> : <Hotel className="h-4 w-4" />
  const handleLocationChange = (value: string) => {
    setSelectedLocation(userLocations.find(location => location.id === value) as LocationOption)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  if (hasNoLocations) return null

  return (
    <>
      <Select onValueChange={handleLocationChange} value={selectedLocation?.id}>
        <SelectTrigger className="w-full p-4 py-6">
          <SelectValue placeholder={t('selectLocation')}>{selectedLocation?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {userLocations.map(location => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

{
  /* <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
      <div className="flex items-center gap-2 cursor-pointer border rounded-md p-3">
        {locationIcon}
        {selectedLocation?.name}
      </div>
    </PopoverTrigger>
    <PopoverContent>
      <div className="space-y-4 mr-4">
        {userLocations.map(location => (
          <div key={location.id} onClick={() => handleLocationChange(location.id)} className="flex items-center gap-2 cursor-pointer">
            {locationIcon}
            {location.name}
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover> */
}
