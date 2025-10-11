'use client'

import { AppSidebar } from '@/components'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useEffect } from 'react'
import { Toaster } from 'sonner'
import { useLocationSelection } from '@shared'
import { LoadingSpinner } from '@/components'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const pathSegments = pathname.split('/').filter(Boolean)
  const { userLocations, isLoading, hasNoLocations } = useLocationSelection()

  // Redirect to onboarding if user has no locations (except if already on onboarding)
  useEffect(() => {
    if (!isLoading && hasNoLocations && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding')
    }
  }, [hasNoLocations, isLoading, pathname, router])

  // Show loading while checking locations
  if (isLoading && !pathname.startsWith('/onboarding')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  const websitePattern = /\/websites\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
  const isWebsitePage = websitePattern.test(pathname)

  const isOnboardingPage = pathname.startsWith('/onboarding')

  if (isWebsitePage || isOnboardingPage) return children

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = '/' + pathSegments.slice(0, index + 1).join('/')
                  const isLast = index === pathSegments.length - 1
                  const title = segment.charAt(0).toUpperCase() + segment.slice(1)

                  return (
                    <Fragment key={href}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}
