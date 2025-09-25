import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  title?: string
}

export function ErrorMessage({ message, title = 'Error' }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}