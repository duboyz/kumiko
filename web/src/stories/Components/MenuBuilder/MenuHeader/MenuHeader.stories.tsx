import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MenuHeader } from './MenuHeader'

const meta: Meta<typeof MenuHeader> = {
  component: MenuHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Menu title',
    },
    description: {
      control: 'text',
      description: 'Menu description',
    },
    onTitleChange: {
      action: 'title changed',
      description: 'Function called when title changes',
    },
    onDescriptionChange: {
      action: 'description changed',
      description: 'Function called when description changes',
    },
  },
}

export default meta

type Story = StoryObj<typeof MenuHeader>

export const Default: Story = {
  args: {
    title: 'Summer Menu 2024',
    description: 'Fresh seasonal dishes featuring the best ingredients of summer',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const LongTitle: Story = {
  args: {
    title: 'Our Complete Fine Dining Experience Menu with Seasonal Specialties',
    description: 'An exquisite collection of carefully crafted dishes featuring locally sourced ingredients, seasonal specialties, and our chef\'s signature creations',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const ShortContent: Story = {
  args: {
    title: 'Menu',
    description: 'Daily specials',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const EmptyContent: Story = {
  args: {
    title: '',
    description: '',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const BreakfastMenu: Story = {
  args: {
    title: 'Breakfast Menu',
    description: 'Start your day right with our hearty breakfast options, available until 11:30 AM',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const DinnerMenu: Story = {
  args: {
    title: 'Dinner Menu',
    description: 'Elegant evening dining featuring premium steaks, fresh seafood, and vegetarian delights',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const DrinksMenu: Story = {
  args: {
    title: 'Beverage Menu',
    description: 'Craft cocktails, fine wines, local beers, and specialty non-alcoholic beverages',
    onTitleChange: (title: string) => console.log('Title changed:', title),
    onDescriptionChange: (description: string) => console.log('Description changed:', description),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Editable Menu Header</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click the edit button to modify the title and description. Try editing the content below:
        </p>
        <MenuHeader
          title="Interactive Demo Menu"
          description="This header is fully interactive - try clicking the edit button to change this text!"
          onTitleChange={(title: string) => console.log('New title:', title)}
          onDescriptionChange={(description: string) => console.log('New description:', description)}
        />
      </div>
    </div>
  )
}

export const MultipleMenus = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <MenuHeader
        title="Breakfast Menu"
        description="Available 6:00 AM - 11:30 AM daily"
        onTitleChange={(title: string) => console.log('Breakfast title:', title)}
        onDescriptionChange={(description: string) => console.log('Breakfast description:', description)}
      />
      <MenuHeader
        title="Lunch Menu"
        description="Available 11:30 AM - 4:00 PM daily"
        onTitleChange={(title: string) => console.log('Lunch title:', title)}
        onDescriptionChange={(description: string) => console.log('Lunch description:', description)}
      />
      <MenuHeader
        title="Dinner Menu"
        description="Available 4:00 PM - 10:00 PM daily"
        onTitleChange={(title: string) => console.log('Dinner title:', title)}
        onDescriptionChange={(description: string) => console.log('Dinner description:', description)}
      />
    </div>
  )
}