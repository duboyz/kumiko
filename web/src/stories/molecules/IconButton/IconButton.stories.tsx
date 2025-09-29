import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import { IconButton } from './IconButton'

const meta = {
  component: IconButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {},
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: Plus,
    children: 'Add Item',
    onClick: () => console.log('Clicked!'),
    'aria-label': 'Add item',
  },
}

export const Destructive: Story = {
  args: {
    icon: Trash2,
    children: 'Delete',
    variant: 'destructive',
    onClick: () => console.log('Delete clicked!'),
    'aria-label': 'Delete item',
  },
}

export const Outline: Story = {
  args: {
    icon: Edit,
    children: 'Edit',
    variant: 'outline',
    onClick: () => console.log('Edit clicked!'),
    'aria-label': 'Edit item',
  },
}

export const Small: Story = {
  args: {
    icon: Save,
    children: 'Save',
    size: 'sm',
    onClick: () => console.log('Save clicked!'),
    'aria-label': 'Save changes',
  },
}

export const Disabled: Story = {
  args: {
    icon: X,
    children: 'Close',
    disabled: true,
    onClick: () => console.log('This should not fire'),
    'aria-label': 'Close (disabled)',
  },
}

export const AllVariants: Story = {
  args: {
    icon: Plus,
    children: 'Add',
    variant: 'default',
    'aria-label': 'Add',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <IconButton icon={Plus} variant="default" aria-label="Add">
        Add
      </IconButton>
      <IconButton icon={Trash2} variant="destructive" aria-label="Delete">
        Delete
      </IconButton>
      <IconButton icon={Edit} variant="outline" aria-label="Edit">
        Edit
      </IconButton>
      <IconButton icon={Save} variant="secondary" aria-label="Save">
        Save
      </IconButton>
      <IconButton icon={X} variant="ghost" aria-label="Close">
        Close
      </IconButton>
    </div>
  ),
}

export const AllSizes: Story = {
  args: {
    icon: Plus,
    children: 'Add',
    size: 'default',
    'aria-label': 'Default',
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={Plus} size="sm" aria-label="Small">
        Small
      </IconButton>
      <IconButton icon={Plus} size="default" aria-label="Default">
        Default
      </IconButton>
      <IconButton icon={Plus} size="lg" aria-label="Large">
        Large
      </IconButton>
      <IconButton icon={Plus} size="icon" aria-label="Icon size">
        Icon
      </IconButton>
    </div>
  ),
}
