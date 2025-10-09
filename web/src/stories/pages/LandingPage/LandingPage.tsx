import { FlowSection } from './FlowSection'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection } from './PricingSection'

export const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FlowSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
