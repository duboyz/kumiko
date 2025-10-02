import { ErrorState } from '@/stories/shared/ErrorState/ErrorState'

interface ContentLoadingErrorProps {
  title: string
  message: string
  backToText: string
  backToLink: string
  onBackClick?: () => void
}

/**
 * @deprecated Use ErrorState component instead
 * This component will be removed in a future version
 */
export const ContentLoadingError = ({
  title,
  message,
  backToText,
  backToLink,
  onBackClick,
}: ContentLoadingErrorProps) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      console.log('Navigate to:', backToLink)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <ErrorState
        title={title}
        message={message}
        action={{
          label: backToText,
          onClick: handleBackClick,
        }}
      />
    </div>
  )
}
