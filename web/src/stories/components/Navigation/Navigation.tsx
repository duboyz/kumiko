'use client'

import { SmoothScrollLink } from '../components/SmoothScrollLink'

interface NavigationProps {
  className?: string
}

export const Navigation = ({ className = '' }: NavigationProps) => {
  const navItems = [
    { href: '#hero', label: 'Home' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#features', label: 'Features' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#early-bird', label: 'Get Started' },
  ]

  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      {navItems.map(item => (
        <SmoothScrollLink
          key={item.href}
          href={item.href}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          offset={-80} // Account for fixed header
        >
          {item.label}
        </SmoothScrollLink>
      ))}
    </nav>
  )
}
