'use client'
import { useState } from 'react'
import { useDeleteRestaurantMenu } from '@shared/hooks/menu.hooks'
import { RestaurantMenuDto } from '@shared/types/menu.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { MenuSquare, Edit, Eye, Trash2, MoreVertical, Calendar } from 'lucide-react'
import { RestaurantMenuSection } from '@/stories/organisms/RestaurantMenuSection/RestaurantMenuSection'
import { Badge } from '@/components/ui/badge'

export const RestaurantMenuCard = ({ menu, router }: { menu: RestaurantMenuDto; router: AppRouterInstance }) => {
    const { mutate: deleteMenu } = useDeleteRestaurantMenu()
    const [showPreview, setShowPreview] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = () => {
        deleteMenu(menu.id)
        setShowDeleteDialog(false)
    }

    const categoryCount = menu.categories?.length || 0
    const itemCount = menu.categories?.reduce((total, cat) => total + (cat.menuCategoryItems?.length || 0), 0) || 0

    return (
        <>
            <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <MenuSquare className="w-5 h-5 text-primary flex-shrink-0" />
                                <CardTitle className="text-xl truncate">{menu.name}</CardTitle>
                            </div>
                            {menu.description && (
                                <CardDescription className="line-clamp-2 text-sm">{menu.description}</CardDescription>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/menus/${menu.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Menu
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="font-normal">
                            {categoryCount} {categoryCount === 1 ? 'Category' : 'Categories'}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Updated {new Date(menu.updatedAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>

                <CardFooter className="pt-3 border-t bg-muted/30">
                    <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowPreview(true)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => router.push(`/menus/${menu.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Menu Preview</DialogTitle>
                        <DialogDescription>This is how your menu will appear to customers</DialogDescription>
                    </DialogHeader>
                    <div className="border rounded-lg overflow-hidden">
                        <RestaurantMenuSection restaurantMenu={menu} allowOrdering={false} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Menu</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{menu.name}"? This action cannot be undone and will
                            permanently remove all categories and items in this menu.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Menu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
