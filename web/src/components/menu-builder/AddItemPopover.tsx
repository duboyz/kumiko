'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Plus, Search } from 'lucide-react'
import { MenuItemDto } from '../../../shared/types/menuTypes'

interface AddItemPopoverProps {
    categoryId: string
    categoryName: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => void
    getAvailableExistingItems: () => MenuItemDto[]
}

export function AddItemPopover({
    categoryId,
    categoryName,
    isOpen,
    onOpenChange,
    onModeSelect,
    getAvailableExistingItems
}: AddItemPopoverProps) {
    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium leading-none">Add Menu Item</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                            Choose how you'd like to add a menu item to {categoryName}
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onModeSelect('existing', categoryId)}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Add Existing Item
                            <span className="ml-auto text-xs text-muted-foreground">
                                {getAvailableExistingItems().length} available
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => onModeSelect('new', categoryId)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Item
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
