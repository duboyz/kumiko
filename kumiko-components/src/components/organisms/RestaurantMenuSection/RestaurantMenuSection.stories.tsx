import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RestaurantMenuSection, type RestaurantMenu } from './RestaurantMenuSection';

// Sample menu data for stories
const sampleMenu: RestaurantMenu = {
  id: 'menu-1',
  name: 'Tanaka Ramen',
  description: 'Authentic Japanese ramen crafted with traditional techniques and the freshest ingredients.',
  categories: [
    {
      id: 'cat-1',
      name: 'Signature Ramen',
      description: 'Our house specialties, perfected over generations',
      orderIndex: 1,
      items: [
        {
          id: 'item-1',
          name: 'Tonkotsu Ramen',
          description: 'Rich pork bone broth with tender chashu, soft-boiled egg, and fresh scallions',
          price: 18.50,
          isAvailable: true,
          imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'item-2',
          name: 'Miso Ramen',
          description: 'Fermented soybean broth with corn, butter, and ground pork',
          price: 16.00,
          isAvailable: true,
        },
        {
          id: 'item-3',
          name: 'Shoyu Ramen',
          description: 'Clear soy sauce broth with bamboo shoots and nori',
          price: 15.50,
          isAvailable: false,
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Appetizers',
      description: 'Small plates to start your meal',
      orderIndex: 2,
      items: [
        {
          id: 'item-4',
          name: 'Gyoza',
          description: 'Pan-fried pork dumplings with ponzu dipping sauce',
          price: 8.00,
          isAvailable: true,
          imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'item-5',
          name: 'Edamame',
          description: 'Steamed young soybeans with sea salt',
          price: 5.50,
          isAvailable: true,
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Beverages',
      orderIndex: 3,
      items: [
        {
          id: 'item-6',
          name: 'Green Tea',
          description: 'Premium sencha tea',
          price: 3.00,
          isAvailable: true,
        },
        {
          id: 'item-7',
          name: 'Japanese Beer',
          description: 'Asahi Super Dry',
          price: 6.00,
          isAvailable: true,
        },
      ],
    },
  ],
};

const emptyMenu: RestaurantMenu = {
  id: 'empty-menu',
  name: 'New Restaurant',
  description: 'Menu coming soon!',
  categories: [],
};

const meta: Meta<typeof RestaurantMenuSection> = {
  title: 'Kumiko/Organisms/RestaurantMenuSection',
  component: RestaurantMenuSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive restaurant menu display component with Japanese minimalist design. Features categories, items, pricing, and ordering functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    menu: {
      control: 'object',
      description: 'Restaurant menu data object',
    },
    allowOrdering: {
      control: 'boolean',
      description: 'Show add to cart buttons',
    },
    showPrices: {
      control: 'boolean',
      description: 'Display item prices',
    },
    showImages: {
      control: 'boolean',
      description: 'Display item images when available',
    },
    itemVariant: {
      control: 'select',
      options: ['card', 'minimal', 'clean'],
      description: 'Visual style for menu items',
    },
    layout: {
      control: 'select',
      options: ['grid', 'list', 'compact'],
      description: 'Overall layout style',
    },
    spacing: {
      control: 'select',
      options: ['compact', 'normal', 'spacious'],
      description: 'Vertical spacing amount',
    },
  },
  args: {
    onAddToCart: fn(),
    onItemClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    menu: sampleMenu,
  },
};

export const WithImages: Story = {
  args: {
    menu: sampleMenu,
    showImages: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with item images displayed.',
      },
    },
  },
};

export const WithoutOrdering: Story = {
  args: {
    menu: sampleMenu,
    allowOrdering: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu without add to cart functionality.',
      },
    },
  },
};

export const WithoutPrices: Story = {
  args: {
    menu: sampleMenu,
    showPrices: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu without price display.',
      },
    },
  },
};

export const EmptyMenu: Story = {
  args: {
    menu: emptyMenu,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no menu categories are available.',
      },
    },
  },
};

// Item variant styles
export const ItemVariants: Story = {
  render: () => (
    <div className="space-y-12">
      <RestaurantMenuSection
        menu={sampleMenu}
        itemVariant="card"
        showImages={true}
      />
      <RestaurantMenuSection
        menu={sampleMenu}
        itemVariant="minimal"
      />
      <RestaurantMenuSection
        menu={sampleMenu}
        itemVariant="clean"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual styles for menu items.',
      },
    },
  },
};

// Layout variations
export const LayoutVariations: Story = {
  render: () => (
    <div className="space-y-8 bg-kumiko-gray-25">
      <div className="bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Grid Layout</h3>
        <RestaurantMenuSection
          menu={sampleMenu}
          layout="grid"
          spacing="compact"
        />
      </div>
      <div className="bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">List Layout</h3>
        <RestaurantMenuSection
          menu={sampleMenu}
          layout="list"
          spacing="compact"
        />
      </div>
      <div className="bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Compact Layout</h3>
        <RestaurantMenuSection
          menu={sampleMenu}
          layout="compact"
          spacing="compact"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different layout options for menu organization.',
      },
    },
  },
};

// Interactive example
export const InteractiveOrdering: Story = {
  render: () => {
    const [cartItems, setCartItems] = React.useState<string[]>([]);

    const handleAddToCart = (item: any) => {
      setCartItems(prev => [...prev, item.name]);
      // In a real app, this would integrate with cart management
    };

    return (
      <div>
        {cartItems.length > 0 && (
          <div className="bg-kumiko-gray-25 p-4 mb-6 rounded-base">
            <h4 className="font-medium mb-2">Cart Items:</h4>
            <ul className="text-sm text-kumiko-gray-700">
              {cartItems.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        <RestaurantMenuSection
          menu={sampleMenu}
          showImages={true}
          onAddToCart={handleAddToCart}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing cart functionality.',
      },
    },
  },
};

// Real-world examples
export const FineRestaurant: Story = {
  args: {
    menu: {
      id: 'fine-dining',
      name: 'Sakura',
      description: 'Omakase dining experience featuring seasonal ingredients and traditional techniques',
      categories: [
        {
          id: 'omakase',
          name: 'Omakase',
          description: "Chef's choice tasting menu",
          orderIndex: 1,
          items: [
            {
              id: 'spring-omakase',
              name: 'Spring Omakase',
              description: '8-course seasonal tasting menu with sake pairing',
              price: 180.00,
              isAvailable: true,
            },
            {
              id: 'summer-omakase',
              name: 'Summer Omakase',
              description: '10-course premium experience with premium sake selection',
              price: 250.00,
              isAvailable: true,
            },
          ],
        },
        {
          id: 'sushi',
          name: 'Nigiri Sushi',
          description: 'Fresh daily selection',
          orderIndex: 2,
          items: [
            {
              id: 'otoro',
              name: 'Otoro',
              description: 'Fatty tuna belly',
              price: 24.00,
              isAvailable: true,
            },
            {
              id: 'uni',
              name: 'Uni',
              description: 'Sea urchin from Hokkaido',
              price: 18.00,
              isAvailable: false,
            },
          ],
        },
      ],
    },
    itemVariant: 'clean',
    spacing: 'spacious',
    allowOrdering: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example for a fine dining restaurant.',
      },
    },
  },
};

export const CasualCafe: Story = {
  args: {
    menu: {
      id: 'cafe',
      name: 'Morning Glory Cafe',
      description: 'Fresh coffee and light bites',
      categories: [
        {
          id: 'coffee',
          name: 'Coffee',
          orderIndex: 1,
          items: [
            {
              id: 'americano',
              name: 'Americano',
              description: 'Double shot with hot water',
              price: 4.50,
              isAvailable: true,
            },
            {
              id: 'latte',
              name: 'Cafe Latte',
              description: 'Espresso with steamed milk',
              price: 5.50,
              isAvailable: true,
            },
          ],
        },
        {
          id: 'pastries',
          name: 'Pastries',
          orderIndex: 2,
          items: [
            {
              id: 'croissant',
              name: 'Butter Croissant',
              description: 'Flaky, buttery pastry',
              price: 3.50,
              isAvailable: true,
            },
          ],
        },
      ],
    },
    itemVariant: 'minimal',
    layout: 'compact',
    showImages: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example for a casual cafe.',
      },
    },
  },
};