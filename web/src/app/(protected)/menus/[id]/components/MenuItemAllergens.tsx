import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle } from 'lucide-react'

interface Allergen {
  id: string
  name: string
}

interface MenuItemAllergensProps {
  allergens: Allergen[]
  selectedAllergenIds: string[]
  isEditing: boolean
  allAllergens?: Allergen[]
  onToggleAllergen?: (allergenId: string) => void
}

export const MenuItemAllergens = ({
  allergens,
  selectedAllergenIds,
  isEditing,
  allAllergens,
  onToggleAllergen,
}: MenuItemAllergensProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </div>
        <h4 className="font-semibold text-base text-gray-900">Allergen Information</h4>
      </div>

      {isEditing && allAllergens ? (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-3">Select all allergens present in this item</p>
          <div className="grid grid-cols-2 gap-3">
            {allAllergens.map(allergen => (
              <div
                key={allergen.id}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  selectedAllergenIds.includes(allergen.id)
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  id={`allergen-${allergen.id}`}
                  checked={selectedAllergenIds.includes(allergen.id)}
                  onCheckedChange={() => onToggleAllergen?.(allergen.id)}
                />
                <label
                  htmlFor={`allergen-${allergen.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {allergen.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : allergens.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allergens.map(allergen => (
            <Badge
              key={allergen.id}
              variant="outline"
              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              {allergen.name}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No allergens declared</p>
          </div>
        </div>
      )}
    </div>
  )
}
