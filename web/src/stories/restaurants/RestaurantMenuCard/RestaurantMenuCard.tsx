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
import { RestaurantMenuSection } from '@/stories/menus/RestaurantMenuSection/RestaurantMenuSection'
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
      <Card
        className="group relative hover:shadow-sm transition-shadow duration-200 cursor-pointer"
        onClick={() => router.push(`/menus/${menu.id}`)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MenuSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <CardTitle className="text-lg truncate">{menu.name}</CardTitle>
              </div>
              {menu.description && <CardDescription className="line-clamp-2">{menu.description}</CardDescription>}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="flex-shrink-0 -mt-1 -mr-2">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    router.push(`/menus/${menu.id}`)
                  }}
                >
                  <Edit />
                  Edit Menu
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    setShowPreview(true)
                  }}
                >
                  <Eye />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={e => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {categoryCount} {categoryCount === 1 ? 'Category' : 'Categories'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Updated {new Date(menu.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
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
              Are you sure you want to delete "{menu.name}"? This action cannot be undone and will permanently remove
              all categories and items in this menu.
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
