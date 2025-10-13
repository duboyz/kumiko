import { FlowSection } from './FlowSection'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection } from './PricingSection'
import { SavingsCalculator } from '@/stories/landing/SavingsCalculator'

export const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FlowSection />
      <FeaturesSection />
      <SavingsCalculator />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
