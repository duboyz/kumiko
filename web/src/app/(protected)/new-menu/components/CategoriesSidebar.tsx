import { MenuCategoryDto } from "@shared";
import { cn } from "@/lib/utils";

export const CategoriesSidebar = ({ categories, selectedCategory, setSelectedCategory }: { categories: MenuCategoryDto[], selectedCategory: MenuCategoryDto | null, setSelectedCategory: (category: MenuCategoryDto | null) => void }) => {
    return <div>
        {categories.map((category) => (
            <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                    'p-2 rounded-md cursor-pointer',
                    selectedCategory?.id === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-transparent text-foreground')}
            >
                {category.name}
            </div>
        ))}
    </div>;
}
