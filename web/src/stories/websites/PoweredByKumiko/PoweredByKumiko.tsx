import Link from 'next/link'
import Image from 'next/image'

interface PoweredByKumikoProps {
  className?: string
}

export function PoweredByKumiko({ className = '' }: PoweredByKumikoProps) {
  return (
    <div className={`flex items-center justify-center py-3 sm:py-4 border-t border-border/50 bg-muted/20 ${className}`}>
      <Link
        href="https://kumiko.no"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <span>Powered by</span>
        <Image
          src="/icons/kumiko-website.png"
          alt="Kumiko"
          width={60}
          height={60}
          className="w-[44px] h-auto object-contain"
        />
        <span className="font-semibold text-primary group-hover:underline">Kumiko</span>
      </Link>
    </div>
  )
}
