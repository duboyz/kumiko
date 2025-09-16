'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit2, Check } from 'lucide-react'

interface MenuHeaderProps {
    title: string
    description: string
    onTitleChange: (title: string) => void
    onDescriptionChange: (description: string) => void
}

export function MenuHeader({ title, description, onTitleChange, onDescriptionChange }: MenuHeaderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempTitle, setTempTitle] = useState(title)
    const [tempDescription, setTempDescription] = useState(description)

    const handleSave = () => {
        onTitleChange(tempTitle)
        onDescriptionChange(tempDescription)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempTitle(title)
        setTempDescription(description)
        setIsEditing(false)
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-3">
                                <Input
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="text-2xl font-bold h-12"
                                    placeholder="Menu title..."
                                />
                                <Textarea
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                    className="text-base"
                                    placeholder="Menu description..."
                                    rows={2}
                                />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                                <p className="text-lg text-muted-foreground mt-2">{description}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 ml-4">
                        {isEditing ? (
                            <>
                                <Button variant="outline" size="sm" onClick={handleSave}>
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}
