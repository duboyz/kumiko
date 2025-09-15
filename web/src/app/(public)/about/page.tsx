import { ContentContainer } from '@/components/ContentContainer'

export default function AboutPage() {
  return (
    <ContentContainer className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Welcome to Kumiko - Your modern booking and business management platform.
      </p>
      <p className="text-muted-foreground">
        We help businesses streamline their operations and provide exceptional service to their customers.
      </p>
    </ContentContainer>
  )
}