import { FlowSection } from './FlowSection'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection } from './PricingSection'
import { SavingsCalculator } from '@/stories/landing/SavingsCalculator'
import { PaymentFlowSection } from '@/stories/landing/PaymentFlowSection'
import { SetupTimeSection } from '@/stories/landing/SetupTimeSection'
import { CompetitorComparison } from '@/stories/landing/CompetitorComparison'
import { WebsiteQualitySection } from '@/stories/landing/WebsiteQualitySection'

export const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FlowSection />
      <WebsiteQualitySection />
      <SetupTimeSection />
      <PaymentFlowSection />
      <FeaturesSection />
      <SavingsCalculator />
      <CompetitorComparison />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
