'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'

interface EditWarningDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    editTarget: { type: 'category' | 'item', id: string, categoryId?: string } | null
    onConfirmEdit: () => void
}

export function EditWarningDialog({
    isOpen,
    onOpenChange,
    editTarget,
    onConfirmEdit
}: EditWarningDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Edit Warning
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {editTarget?.type === 'category' ? (
                            <>
                                You are about to edit this category. Changes to the category name and description will be visible wherever this category is used across your restaurant menus.
                            </>
                        ) : (
                            <>
                                You are about to edit this menu item. This action will affect everywhere this item is used across your restaurant menus. Changes to name, description, and price will be reflected in all locations.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmEdit}
                        className="bg-amber-500 text-white hover:bg-amber-600"
                    >
                        Continue Editing
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
