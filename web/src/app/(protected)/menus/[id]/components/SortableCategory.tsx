import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { MenuCategoryDto } from '@shared'
import { CategoryItemsTable } from './CategoryItemsTable'

interface SortableCategoryProps {
  menuCategory: MenuCategoryDto
}

export const SortableCategory = ({ menuCategory }: SortableCategoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menuCategory.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-8 ${isDragging ? 'pointer-events-none select-none' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{menuCategory.name}</h2>
            {menuCategory.description && (
              <p className="text-gray-600">{menuCategory.description}</p>
            )}
          </div>
        </div>
      </div>

      <CategoryItemsTable menuCategory={menuCategory} />
    </div>
  )
}
