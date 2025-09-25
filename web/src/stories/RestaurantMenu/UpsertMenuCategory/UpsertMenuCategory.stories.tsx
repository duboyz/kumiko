import { StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { UpsertMenuCategory } from './UpsertMenuCategory'

const meta = {
  component: UpsertMenuCategory,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categoryName: 'Appetizers',
    setCategoryName: () => {},
    items: [
      { id: '1', name: 'Våruller', descripton: 'Some tasty spring rolls', price: 199, isAvailable: true },
      { id: '2', name: 'Kebab', descripton: 'Some tasty kebab', price: 299, isAvailable: true },
      { id: '3', name: 'Pizza', descripton: 'Some tasty pizza', price: 399, isAvailable: true },
      { id: '4', name: 'Salad', descripton: 'Some tasty salad', price: 149, isAvailable: true },
    ],
    onRowSave: () => {},
    onRowDelete: () => {},
    onRowEdit: () => {},
    onAddItem: () => {},
  },
  render: args => {
    const [categoryName, setCategoryName] = useState(args.categoryName)
    const [items, setItems] = useState(args.items)

    const handleRowSave = (item: (typeof items)[0]) => {
      setItems(prev => prev.map(i => (i.id === item.id ? item : i)))
    }

    const handleRowDelete = (item: (typeof items)[0]) => {
      setItems(prev => prev.filter(i => i.id !== item.id))
    }

    const handleRowEdit = (item: (typeof items)[0]) => {
      console.log('Editing item:', item)
    }

    const handleAddItem = () => {
      const newItem = {
        id: Date.now().toString(),
        name: 'New Item',
        descripton: 'Item description',
        price: 0,
        isAvailable: true,
      }
      setItems(prev => [...prev, newItem])
    }

    return (
      <UpsertMenuCategory
        {...args}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        items={items}
        onRowSave={handleRowSave}
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
        onAddItem={handleAddItem}
      />
    )
  },
}
