import { MenuCategoryDto, useUpdateMenuCategory } from '@shared'
import { useMemo, useState } from 'react'
import { MenuItem } from '../MenuItem'
import { NewMenuItemForm } from '../NewMenuItemForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components'
import { ChevronDown, ChevronUp, Edit, GripVertical, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export const MenuCategory = ({ category }: { category: MenuCategoryDto }) => {
  const [categoryName, setCategoryName] = useState(category.name || '')
  const [categoryDescription, setCategoryDescription] = useState(category.description || '')
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [showNewItemForm, setShowNewItemForm] = useState(false)

  const menuItems = useMemo(() => category.menuCategoryItems.map(item => item.menuItem), [category])

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory()

  const handleSave = () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    updateCategory(
      {
        id: category.id,
        name: categoryName,
        description: categoryDescription,
        orderIndex: category.orderIndex,
      },
      {
        onSuccess: () => {
          toast.success('Category updated successfully')
          setIsEditing(false)
        },
        onError: () => {
          toast.error('Failed to update category')
        }
      }
    )
  }

  const handleStartEdit = () => {
    setCategoryName(category.name || '')
    setCategoryDescription(category.description || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleCancelNewItem = () => setShowNewItemForm(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b pb-8">
      <div className="flex items-center justify-between gap-4 mb-6 group">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Category Name"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
              />
              <Input
                placeholder="Category Description"
                value={categoryDescription}
                onChange={e => setCategoryDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 flex-1 text-left min-w-0 group/trigger">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold uppercase tracking-wide mb-1 truncate">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground truncate">{category.description}</p>
                    )}
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleStartEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      <CollapsibleContent className="space-y-0">
        <div className="space-y-4 pl-8">
          {menuItems.map(item => (
            <MenuItem key={item?.id} item={item} />
          ))}
          
          <div className="pt-4">
            <NewMenuItemForm
              onCancel={handleCancelNewItem}
              category={category}
              isVisible={showNewItemForm}
              setIsVisible={setShowNewItemForm}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
