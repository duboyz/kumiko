import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-black/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-white">
            Kumiko
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm hover:underline text-white">
              About
            </Link>
            <Link href="/contact" className="text-sm hover:underline text-white">
              Contact
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <Link href="/login" className="text-sm hover:underline text-white">
                Login
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <Link href="/register" className="text-sm hover:underline text-white">
                Register
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
}
