'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'
import { LocationOption, useLocationSelection } from '@shared'
import { LoadingSpinner } from '@/components'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import {
  LayoutDashboard,
  Globe,
  Settings,
  Menu as MenuIcon, Hotel,
  ForkKnifeCrossed,
  ShoppingCart
} from 'lucide-react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const pathSegments = pathname.split('/').filter(Boolean)
  const { isLoading, hasNoLocations, selectedLocation } = useLocationSelection()
  const selectedLocationType = selectedLocation?.type || 'Restaurant'

  const links = useMemo(() => {
    const links = [{
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    }]

    if (selectedLocationType === 'Restaurant') {
      links.push(...[{
        label: 'Menus',
        href: '/menus',
        icon: MenuIcon,
      }, {
        label: 'Orders',
        href: '/orders',
        icon: ShoppingCart,
      }])
    }

    links.push(...[
      {
        label: 'Websites',
        href: '/websites',
        icon: Globe,
      },
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ])

    return links
  }, [selectedLocationType])

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

  if (isWebsitePage || isOnboardingPage) return children

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Location Selector Section */}
        <div className="p-6 border-b border-gray-200">
          <LocationSelector />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
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
                    className={`w-5 h-5 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'
                      }`}
                  />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Section - Optional user info or branding */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-24" />
              <div className="h-2 bg-gray-100 rounded animate-pulse w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="h-full">
          {children}
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export function LocationSelector() {
  const { selectedLocation, userLocations, isLoading, hasNoLocations, setSelectedLocation } = useLocationSelection()
  const [isOpen, setIsOpen] = useState(false)
  const locationType = selectedLocation?.type || 'Restaurant'
  const locationIcon = locationType === 'Restaurant' ? <ForkKnifeCrossed className="h-4 w-4" /> : <Hotel className="h-4 w-4" />
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
          <SelectValue placeholder="Select Location">
            {selectedLocation?.name}
          </SelectValue>
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

{/* <Popover open={isOpen} onOpenChange={setIsOpen}>
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
  </Popover> */}