'use client'
import { HeroSection } from '@/stories/pages/LandingPage/HeroSection'
import { ScrollTriggerSection } from '@/stories/pages/LandingPage/ScrollTrigger/ScrollTriggerSection'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ScrollTriggerSection />
    </div>
  )
}
