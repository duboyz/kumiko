import { ErrorState } from '@/stories/shared/ErrorState/ErrorState'

interface ErrorMessageProps {
  message: string
  title?: string
}

/**
 * @deprecated Use ErrorState component instead
 * This component will be removed in a future version
 */
export function ErrorMessage({ message, title = 'Error' }: ErrorMessageProps) {
  return <ErrorState title={title} message={message} variant="card" />
}
