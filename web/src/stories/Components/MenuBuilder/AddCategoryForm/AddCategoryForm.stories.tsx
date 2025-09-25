import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AddCategoryForm } from './AddCategoryForm'

const meta: Meta<typeof AddCategoryForm> = {
  component: AddCategoryForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onAddCategory: {
      action: 'category added',
      description: 'Function called when category is added',
    },
  },
}

export default meta

type Story = StoryObj<typeof AddCategoryForm>

export const Default: Story = {
  args: {
    onAddCategory: (category) => console.log('Add category:', category),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Add Category Form</h3>
        <p className="text-sm text-gray-600 mb-4">
          This form allows users to add new menu categories. Click "Add Category" to reveal the form, then fill in the details and save.
        </p>
        <AddCategoryForm
          onAddCategory={(category) => {
            console.log('Demo category added:', category)
            alert(`Category "${category.name}" added! Check console for details.`)
          }}
        />
      </div>
    </div>
  )
}