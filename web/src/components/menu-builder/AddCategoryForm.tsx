'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Save, X } from 'lucide-react'
import { CreateMenuCategoryCommand } from "../../../shared/types/menu.types"

interface AddCategoryFormProps {
    onAddCategory: (category: CreateMenuCategoryCommand) => void
}

export function AddCategoryForm({ onAddCategory }: AddCategoryFormProps) {
    const [showForm, setShowForm] = useState(false)
    const [newCategory, setNewCategory] = useState<CreateMenuCategoryCommand>({
        name: '',
        description: '',
        orderIndex: 0,
        restaurantMenuId: 'menu-1'
    })

    const handleSubmit = () => {
        if (!newCategory.name.trim()) return

        onAddCategory(newCategory)
        setNewCategory({ name: '', description: '', orderIndex: 0, restaurantMenuId: 'menu-1' })
        setShowForm(false)
    }

    const handleCancel = () => {
        setNewCategory({ name: '', description: '', orderIndex: 0, restaurantMenuId: 'menu-1' })
        setShowForm(false)
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Menu Categories</CardTitle>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant={showForm ? "outline" : "default"}
                    >
                        {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {showForm ? 'Cancel' : 'Add Category'}
                    </Button>
                </div>
            </CardHeader>
            {showForm && (
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            placeholder="Category name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                        <Input
                            placeholder="Category description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        />
                        <Button onClick={handleSubmit}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Category
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
