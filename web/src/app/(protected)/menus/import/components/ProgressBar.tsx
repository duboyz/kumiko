import { Check } from 'lucide-react'
import { ImportStep } from './ImportWizard'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: ImportStep
  onStepClick: (step: ImportStep) => void
}

const steps = [
  { id: 'upload', title: 'Upload' },
  { id: 'preview', title: 'Annotate' },
  { id: 'process', title: 'Process' },
  { id: 'review', title: 'Review' },
] as const

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="w-full bg-white border-b p-4">
      <div className="flex items-center justify-center max-w-md mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = step.id === currentStep
          const isClickable = index <= currentStepIndex

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id as ImportStep)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                  isClickable && 'hover:bg-gray-50',
                  !isClickable && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    isCompleted && 'bg-green-100 text-green-600',
                    isCurrent && 'bg-primary text-primary-foreground',
                    !isCurrent && !isCompleted && 'bg-gray-100 text-gray-400'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isCompleted && 'text-green-600',
                    isCurrent && 'text-primary',
                    !isCurrent && !isCompleted && 'text-gray-400'
                  )}
                >
                  {step.title}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={cn('w-8 h-px mx-1', index < currentStepIndex ? 'bg-green-300' : 'bg-gray-200')} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
