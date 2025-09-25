import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { MenuItemRow } from './MenuItemRow'

const meta = {
  component: MenuItemRow,
  argTypes: {},
  args: {},
} satisfies Meta<typeof MenuItemRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isEditable: true,
    menuItem: {
      id: '1',
      name: 'Våruller',
      descripton: 'Some description goes here',
      price: 99,
      isAvailable: true,
    },
    handleChange: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onSave: () => {},
  },
  render: args => {
    const [menuItem, setMenuItem] = useState(args.menuItem)
    const [isEditable, setIsEditable] = useState(args.isEditable)

    const handleEdit = () => {
      setIsEditable(true)
    }

    const handleDelete = () => {
      setIsEditable(false)
    }

    const handleSave = () => {
      setIsEditable(false)
    }

    const handleChange = (property: keyof typeof menuItem, value: (typeof menuItem)[keyof typeof menuItem]) => {
      setMenuItem(prev => ({
        ...prev,
        [property]: value,
      }))
    }

    return (
      <MenuItemRow
        {...args}
        isEditable={isEditable}
        menuItem={menuItem}
        handleChange={handleChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
      />
    )
  },
  parameters: {
    layout: 'padded',
  },
}
