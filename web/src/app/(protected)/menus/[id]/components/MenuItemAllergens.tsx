import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

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
    <div>
      <h4 className="font-semibold mb-2 text-sm">Allergens</h4>

      {isEditing && allAllergens ? (
        <div className="flex flex-wrap gap-2">
          {allAllergens.map(allergen => (
            <div key={allergen.id} className="flex items-center gap-2">
              <Checkbox
                id={`allergen-${allergen.id}`}
                checked={selectedAllergenIds.includes(allergen.id)}
                onCheckedChange={() => onToggleAllergen?.(allergen.id)}
              />
              <label
                htmlFor={`allergen-${allergen.id}`}
                className="text-sm cursor-pointer"
              >
                {allergen.name}
              </label>
            </div>
          ))}
        </div>
      ) : allergens.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allergens.map(allergen => (
            <Badge key={allergen.id} variant="outline" className="bg-white">
              {allergen.name}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No allergens</p>
      )}
    </div>
  )
}
