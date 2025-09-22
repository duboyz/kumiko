import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MenuItemOption, type MenuItemOptionData } from './MenuItemOption';
import { KumikoButton } from '../../atoms/KumikoButton';

const meta: Meta<typeof MenuItemOption> = {
  title: 'Kumiko/Molecules/MenuItemOption',
  component: MenuItemOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A menu item option component for adding size variations and pricing options to menu items in the Japanese-inspired menu builder.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showRemoveButton: {
      control: 'boolean',
      description: 'Show the remove button',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto-focus the name input when component mounts',
    },
    placeholder: {
      control: 'object',
      description: 'Custom placeholder text for name and price inputs',
    },
  },
  args: {
    onOptionChange: fn(),
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    option: {
      id: '1',
      name: '',
      price: '',
    },
  },
};

export const WithData: Story = {
  args: {
    option: {
      id: '1',
      name: '6 pieces',
      price: '190 kr',
    },
  },
};

export const WithCustomPlaceholders: Story = {
  args: {
    option: {
      id: '1',
      name: '',
      price: '',
    },
    placeholder: {
      name: 'Size or variation',
      price: 'Price',
    },
  },
};

export const WithoutRemoveButton: Story = {
  args: {
    option: {
      id: '1',
      name: 'Regular',
      price: '150 kr',
    },
    showRemoveButton: false,
  },
};

export const AutoFocus: Story = {
  args: {
    option: {
      id: '1',
      name: '',
      price: '',
    },
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with auto-focus enabled on the name input',
      },
    },
  },
};

// Interactive example with multiple options
export const MultipleOptions: Story = {
  render: () => {
    const [options, setOptions] = React.useState<MenuItemOptionData[]>([
      { id: '1', name: '6 pieces', price: '190 kr' },
      { id: '2', name: '12 pieces', price: '350 kr' },
    ]);

    const updateOption = (index: number, updatedOption: MenuItemOptionData) => {
      setOptions(prev => prev.map((opt, i) => i === index ? updatedOption : opt));
    };

    const removeOption = (index: number) => {
      setOptions(prev => prev.filter((_, i) => i !== index));
    };

    const addOption = () => {
      const newOption: MenuItemOptionData = {
        id: Date.now().toString(),
        name: '',
        price: '',
      };
      setOptions(prev => [...prev, newOption]);
    };

    return (
      <div className="w-96 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-light text-kumiko-black mb-2">Nigiri Options</h3>
          <p className="text-sm text-kumiko-gray-500">Manage size variations and pricing</p>
        </div>

        <div className="border border-kumiko-gray-100 rounded-base p-4">
          <div className="space-y-1">
            {options.map((option, index) => (
              <MenuItemOption
                key={option.id}
                option={option}
                onOptionChange={(updatedOption) => updateOption(index, updatedOption)}
                onRemove={() => removeOption(index)}
                autoFocus={index === options.length - 1 && !option.name}
              />
            ))}

            {options.length === 0 && (
              <div className="text-center py-8 text-kumiko-gray-400">
                No options added yet
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-kumiko-gray-50">
            <KumikoButton
              variant="ghost"
              size="sm"
              onClick={addOption}
              className="w-full"
            >
              + Add Option
            </KumikoButton>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing multiple options with add/remove functionality',
      },
    },
  },
};

// Real-world menu builder example
export const MenuBuilderExample: Story = {
  render: () => {
    const [options, setOptions] = React.useState<MenuItemOptionData[]>([
      { id: '1', name: '6 pieces', price: '190 kr' },
      { id: '2', name: '12 pieces', price: '350 kr' },
    ]);

    const updateOption = (index: number, updatedOption: MenuItemOptionData) => {
      setOptions(prev => prev.map((opt, i) => i === index ? updatedOption : opt));
    };

    const removeOption = (index: number) => {
      setOptions(prev => prev.filter((_, i) => i !== index));
    };

    return (
      <div className="max-w-2xl mx-auto">
        {/* Menu Item Header */}
        <div className="grid grid-cols-4 gap-6 items-start mb-6 pb-6 border-b border-kumiko-gray-50">
          <input
            className="bg-transparent border-0 font-kumiko font-medium text-base text-kumiko-black placeholder:text-kumiko-gray-200 outline-none"
            placeholder="Item name (e.g., Nigiri)"
            defaultValue="Salmon Nigiri"
          />

          <div className="text-sm text-kumiko-gray-500 cursor-pointer border-b border-transparent hover:border-kumiko-gray-50 transition-colors pb-1">
            Fish, Soya
          </div>

          <textarea
            className="bg-transparent border-0 font-kumiko font-normal text-sm text-kumiko-gray-500 placeholder:text-kumiko-gray-200 outline-none resize-none"
            placeholder="Brief description of the dish"
            rows={2}
            defaultValue="Fresh Atlantic salmon over seasoned sushi rice"
          />

          <div className="flex justify-end gap-2">
            <button className="text-kumiko-gray-300 hover:text-kumiko-gray-500 text-lg">+</button>
            <button className="text-kumiko-gray-300 hover:text-kumiko-gray-500 text-lg">×</button>
          </div>
        </div>

        {/* Options Section */}
        <div className="ml-8">
          <div className="space-y-1">
            {options.map((option, index) => (
              <MenuItemOption
                key={option.id}
                option={option}
                onOptionChange={(updatedOption) => updateOption(index, updatedOption)}
                onRemove={() => removeOption(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete menu item editor showing options in context of the menu builder interface',
      },
    },
  },
};

// Different option types
export const OptionTypes: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Size Options</h4>
        <div className="space-y-1">
          <MenuItemOption
            option={{ id: '1', name: 'Small (6 pieces)', price: '140 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '2', name: 'Medium (9 pieces)', price: '190 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '3', name: 'Large (12 pieces)', price: '240 kr' }}
            showRemoveButton={false}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Preparation Options</h4>
        <div className="space-y-1">
          <MenuItemOption
            option={{ id: '4', name: 'Regular', price: '180 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '5', name: 'Spicy', price: '190 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '6', name: 'Extra Spicy', price: '200 kr' }}
            showRemoveButton={false}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Side Options</h4>
        <div className="space-y-1">
          <MenuItemOption
            option={{ id: '7', name: 'With Miso Soup', price: '220 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '8', name: 'With Salad', price: '210 kr' }}
            showRemoveButton={false}
          />
          <MenuItemOption
            option={{ id: '9', name: 'Complete Set', price: '280 kr' }}
            showRemoveButton={false}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different types of menu item options',
      },
    },
  },
};

// Empty states and loading
export const States: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Empty Option</h4>
        <MenuItemOption
          option={{ id: '1', name: '', price: '' }}
          autoFocus
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Partial Data</h4>
        <MenuItemOption
          option={{ id: '2', name: '6 pieces', price: '' }}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Complete Data</h4>
        <MenuItemOption
          option={{ id: '3', name: '12 pieces', price: '350 kr' }}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Without Remove Button</h4>
        <MenuItemOption
          option={{ id: '4', name: 'Default option', price: '190 kr' }}
          showRemoveButton={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states and configurations of the option component',
      },
    },
  },
};