import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Noto_Sans_JP } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kumiko - Precision Business Management',
  description:
    'Enterprise-grade business management platform. Streamline bookings, inventory, locations, and team operations with Japanese-inspired precision.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Providing all messages to the client side
  const messages = await getMessages()

  return (
    <html suppressHydrationWarning>
      <body className={notoSansJP.variable}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
