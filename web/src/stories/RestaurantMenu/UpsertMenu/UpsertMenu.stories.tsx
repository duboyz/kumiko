import { StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { UpsertMenu } from './UpsertMenu'

const meta = {
  component: UpsertMenu,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menuName: 'My Restaurant Menu',
    setMenuName: () => {},
    categories: [],
    onCategoryAdd: () => {},
    onCategoryDelete: () => {},
    onCategoryNameChange: () => {},
    onItemAdd: () => {},
    onItemUpdate: () => {},
    onItemDelete: () => {},
  },
  render: () => {
    const [menuName, setMenuName] = useState('My Restaurant Menu')
    const [categories, setCategories] = useState([
      {
        id: '1',
        name: 'Appetizers',
        items: [
          { id: '1', name: 'Våruller', descripton: 'Some tasty spring rolls', price: 199, isAvailable: true },
          { id: '2', name: 'Kebab', descripton: 'Some tasty kebab', price: 299, isAvailable: true },
        ],
      },
      {
        id: '2',
        name: 'Main Courses',
        items: [
          { id: '3', name: 'Pizza', descripton: 'Some tasty pizza', price: 399, isAvailable: true },
          { id: '4', name: 'Pasta', descripton: 'Some tasty pasta', price: 349, isAvailable: true },
        ],
      },
    ])

    const handleCategoryAdd = () => {
      const newCategory = {
        id: Date.now().toString(),
        name: 'New Category',
        items: [],
      }
      setCategories(prev => [...prev, newCategory])
    }

    const handleCategoryDelete = (categoryId: string) => {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }

    const handleCategoryNameChange = (categoryId: string, name: string) => {
      setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, name } : cat)))
    }

    const handleItemAdd = (categoryId: string) => {
      const newItem = {
        id: Date.now().toString(),
        name: 'New Item',
        descripton: 'Item description',
        price: 0,
        isAvailable: true,
      }
      setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat)))
    }

    const handleItemUpdate = (categoryId: string, item: any) => {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId ? { ...cat, items: cat.items.map(i => (i.id === item.id ? item : i)) } : cat
        )
      )
    }

    const handleItemDelete = (categoryId: string, itemId: string) => {
      setCategories(prev =>
        prev.map(cat => (cat.id === categoryId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat))
      )
    }

    return (
      <UpsertMenu
        menuName={menuName}
        setMenuName={setMenuName}
        categories={categories}
        onCategoryAdd={handleCategoryAdd}
        onCategoryDelete={handleCategoryDelete}
        onCategoryNameChange={handleCategoryNameChange}
        onItemAdd={handleItemAdd}
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
      />
    )
  },
}
