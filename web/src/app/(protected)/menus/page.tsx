import { MenuBuilder } from '@/components/menu-builder/MenuBuilder'

export default function MenusPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <p className="text-muted-foreground mt-2">
                    Create and manage your restaurant menus. Add categories, menu items, and organize them with drag and drop.
                </p>
            </div>

            <MenuBuilder />
        </div>
    )
}
