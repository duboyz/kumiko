'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAllergens } from '@shared/hooks'
import { LoadingSpinner } from '@/components'
import { AlertCircle } from 'lucide-react'

interface AllergenSelectorProps {
  selectedAllergenIds: string[]
  onChange: (allergenIds: string[]) => void
  disabled?: boolean
}

export function AllergenSelector({ selectedAllergenIds, onChange, disabled = false }: AllergenSelectorProps) {
  const { data: allergens, isLoading, error } = useAllergens()

  const toggleAllergen = (allergenId: string) => {
    if (disabled) return
    
    const newSelection = selectedAllergenIds.includes(allergenId)
      ? selectedAllergenIds.filter(id => id !== allergenId)
      : [...selectedAllergenIds, allergenId]
    
    onChange(newSelection)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-muted-foreground">Loading allergens...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
        <AlertCircle className="h-4 w-4" />
        <span>Failed to load allergens. Please try again.</span>
      </div>
    )
  }

  if (!allergens || allergens.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No allergens available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Select all allergens present in this item
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allergens.map(allergen => (
          <div key={allergen.id} className="flex items-center space-x-2">
            <Checkbox
              id={`allergen-${allergen.id}`}
              checked={selectedAllergenIds.includes(allergen.id)}
              onCheckedChange={() => toggleAllergen(allergen.id)}
              disabled={disabled}
            />
            <Label
              htmlFor={`allergen-${allergen.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              title={allergen.description}
            >
              {allergen.name}
            </Label>
          </div>
        ))}
      </div>
      {selectedAllergenIds.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedAllergenIds.length} allergen{selectedAllergenIds.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}

