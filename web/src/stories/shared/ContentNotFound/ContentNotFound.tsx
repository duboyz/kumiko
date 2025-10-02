import { AlertCircle } from 'lucide-react'
import { EmptyState } from '@/components'

interface ContentNotFoundProps {
  title: string
  message: string
  backToText: string
  backToLink: string
  onBackClick?: () => void
}

export const ContentNotFound = ({ title, message, backToText, backToLink, onBackClick }: ContentNotFoundProps) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      console.log('Navigate to:', backToLink)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <EmptyState
        icon={AlertCircle}
        title={title}
        description={message}
        action={{
          label: backToText,
          onClick: handleBackClick,
        }}
      />
    </div>
  )
}
