import { ContentContainer } from '@/components/ContentContainer'

export default function ContactPage() {
  return (
    <ContentContainer>
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get in touch with our team for support or inquiries.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-muted-foreground">support@kumiko.com</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Phone</h2>
          <p className="text-muted-foreground">+1 (555) 123-4567</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Office</h2>
          <p className="text-muted-foreground">
            123 Business Street<br />
            Suite 100<br />
            City, State 12345
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Hours</h2>
          <p className="text-muted-foreground">
            Monday - Friday: 9AM - 6PM<br />
            Saturday - Sunday: Closed
          </p>
        </div>
      </div>
    </ContentContainer>
  )
}