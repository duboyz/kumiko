'use client'

import * as React from 'react'
import {
  Home,
  Settings2,
  Globe,
  ChefHat,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarRestaurantSelector } from '@/components/SidebarRestaurantSelector'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocationSelection } from '@shared'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Menus',
    url: '/menus',
    icon: ChefHat,
    restaurantOnly: true,
  },
  {
    title: 'Menu items',
    url: '/menu-items',
    icon: ChefHat,
    restaurantOnly: true,
  },
  {
    title: 'Websites',
    url: '/websites',
    icon: Globe,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { selectedLocation } = useLocationSelection()

  // Filter items based on location type
  const visibleItems = items.filter(item => {
    if (item.restaurantOnly) {
      return selectedLocation?.type === 'Restaurant'
    }
    return true
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarRestaurantSelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Settings2 />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}