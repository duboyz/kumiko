import { Header } from './Header'
import { FlowSection } from './FlowSection'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { EarlyBirdSection } from './EarlyBirdSection'
import { ComicStripSection } from './ComicStripSection'
import { LenisProvider } from '../../components/LenisProvider'

export const LandingPage = () => {
  return (
    <LenisProvider>
      <div>
        <Header />
        <section id="hero">
          <HeroSection />
        </section>
        <section id="how-it-works">
          <FlowSection />
        </section>
        <section id="comic-strip">
          <ComicStripSection />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="early-bird">
          <EarlyBirdSection />
        </section>
      </div>
    </LenisProvider>
  )
}
