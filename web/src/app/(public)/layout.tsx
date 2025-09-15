import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Kumiko
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <Link href="/login" className="text-sm hover:underline">
                Login
              </Link>
              <span className="text-sm text-muted-foreground">|</span>
              <Link href="/register" className="text-sm hover:underline">
                Register
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 Kumiko. All rights reserved.
        </div>
      </footer>
    </div>
  )
}