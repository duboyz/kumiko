import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2, Check, X } from 'lucide-react'
import { MenuCategoryDto, useUpdateMenuCategory, useDeleteMenuCategory } from '@shared'
import { CategoryItemsTable } from './CategoryItemsTable'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface SortableCategoryProps {
  menuCategory: MenuCategoryDto
}

export const SortableCategory = ({ menuCategory }: SortableCategoryProps) => {
  const t = useTranslations('menus')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menuCategory.id })
  const updateCategoryMutation = useUpdateMenuCategory()
  const deleteCategoryMutation = useDeleteMenuCategory()

  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(menuCategory.name)
  const [editedDescription, setEditedDescription] = useState(menuCategory.description || '')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  const handleStartEdit = () => {
    setEditedName(menuCategory.name)
    setEditedDescription(menuCategory.description || '')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedName(menuCategory.name)
    setEditedDescription(menuCategory.description || '')
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error('Category name is required')
      return
    }

    updateCategoryMutation.mutate(
      {
        id: menuCategory.id,
        name: editedName.trim(),
        description: editedDescription.trim(),
        orderIndex: menuCategory.orderIndex,
      },
      {
        onSuccess: () => {
          toast.success('Category updated successfully')
          setIsEditing(false)
        },
        onError: () => {
          toast.error('Failed to update category')
        },
      }
    )
  }

  const handleDelete = () => {
    deleteCategoryMutation.mutate(menuCategory.id, {
      onSuccess: () => {
        toast.success('Category deleted successfully')
        setShowDeleteDialog(false)
      },
      onError: () => {
        toast.error('Failed to delete category')
      },
    })
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`mb-8 ${isDragging ? 'pointer-events-none select-none' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Category name"
                  className="text-2xl font-bold h-12"
                />
                <Input
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Category description (optional)"
                  className="text-base"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{menuCategory.name}</h2>
                {menuCategory.description && (
                  <p className="text-gray-600">{menuCategory.description}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={updateCategoryMutation.isPending}
                  className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={updateCategoryMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartEdit}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <CategoryItemsTable menuCategory={menuCategory} />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{menuCategory.name}&quot;? This will also remove all menu items from this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategoryMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete Category'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
