'use client'

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
import { AlertTriangle } from 'lucide-react'
import { MenuCategoryDto } from '../../../shared/types/menu.types'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  deleteTarget: { type: 'category' | 'item'; id: string; categoryId?: string } | null
  categories: MenuCategoryDto[]
  onConfirmDelete: () => void
}

export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  deleteTarget,
  categories,
  onConfirmDelete,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleteTarget?.type === 'category' ? (
              <>
                Are you sure you want to delete this category? This will permanently remove the category and all{' '}
                {categories.find(cat => cat.id === deleteTarget.id)?.menuCategoryItems.length || 0} menu items within
                it. This action cannot be undone.
              </>
            ) : (
              <>Are you sure you want to delete this menu item? This action cannot be undone.</>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
