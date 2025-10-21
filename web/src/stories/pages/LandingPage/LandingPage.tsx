import { Header } from './Header'
import { FlowSection } from './FlowSection'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { EarlyBirdSection } from './EarlyBirdSection'
import { ComicStripSection } from './ComicStripSection'

export const LandingPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <FlowSection />
      <ComicStripSection />
      <FeaturesSection />
      <TestimonialsSection />
      <EarlyBirdSection />
    </div>
  )
}
