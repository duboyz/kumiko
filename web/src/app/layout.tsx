import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kumiko - Precision Business Management',
  description:
    'Enterprise-grade business management platform. Streamline bookings, inventory, locations, and team operations with Japanese-inspired precision.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nunito.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
