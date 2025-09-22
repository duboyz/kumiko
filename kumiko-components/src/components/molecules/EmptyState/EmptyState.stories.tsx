import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { KumikoButton } from '../../atoms/KumikoButton';

// Simple icons for demo
const ClipboardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
  </svg>
);

const meta: Meta<typeof EmptyState> = {
  title: 'Kumiko/Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimalist empty state component following Japanese design principles, used to communicate when sections have no content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title describing the empty state',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle with additional context',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'minimal'],
    },
    iconColor: {
      control: 'select',
      options: ['default', 'subtle', 'muted'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    icon: <ClipboardIcon />,
    title: 'No items yet',
    subtitle: 'Get started by adding your first item',
  },
};

export const WithAction: Story = {
  args: {
    icon: <PlusIcon />,
    title: 'Your menu is empty',
    subtitle: 'Create your first category to get started',
    action: <KumikoButton>+ New Category</KumikoButton>,
  },
};

export const SimpleText: Story = {
  args: {
    title: 'No results found',
    subtitle: 'Try adjusting your search criteria',
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Small Empty State"
          subtitle="Compact version for smaller spaces"
          size="sm"
        />
      </div>

      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Base Empty State"
          subtitle="Standard size for most use cases"
          size="base"
        />
      </div>

      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Large Empty State"
          subtitle="Spacious version for prominent sections"
          size="lg"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various layout contexts',
      },
    },
  },
};

// Variant styles
export const VariantStyles: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8">
      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Default Variant"
          subtitle="Standard visibility and contrast"
          variant="default"
        />
      </div>

      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Subtle Variant"
          subtitle="Reduced opacity for secondary empty states"
          variant="subtle"
        />
      </div>

      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Minimal Variant"
          subtitle="Very subtle for background empty states"
          variant="minimal"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different opacity levels for visual hierarchy',
      },
    },
  },
};

// Icon color variations
export const IconColors: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8">
      <EmptyState
        icon={<ClipboardIcon />}
        title="Default Icon Color"
        subtitle="Standard gray icon"
        iconColor="default"
      />

      <EmptyState
        icon={<ClipboardIcon />}
        title="Subtle Icon Color"
        subtitle="Lighter gray icon"
        iconColor="subtle"
      />

      <EmptyState
        icon={<ClipboardIcon />}
        title="Muted Icon Color"
        subtitle="Medium gray icon"
        iconColor="muted"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different icon color intensities',
      },
    },
  },
};

// Real-world examples from prototypes
export const MenuBuilderExamples: Story = {
  render: () => (
    <div className="space-y-12 max-w-2xl">
      {/* Menu empty state */}
      <div className="border border-dashed border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<ClipboardIcon />}
          title="Your menu is empty"
          subtitle="Create your first category to get started"
          action={<KumikoButton>+ New Category</KumikoButton>}
        />
      </div>

      {/* Category empty state */}
      <div className="border border-dashed border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<PlusIcon />}
          title="No items yet"
          subtitle="Click + to add your first item"
          size="sm"
          variant="subtle"
        />
      </div>

      {/* Search empty state */}
      <div className="border border-kumiko-gray-100 rounded-base">
        <EmptyState
          icon={<SearchIcon />}
          title="No items found"
          subtitle="Try adjusting your search or add a new item"
          size="base"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty states matching the menu builder prototype patterns',
      },
    },
  },
};

// Different action types
export const ActionTypes: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8">
      <EmptyState
        icon={<PlusIcon />}
        title="Single Action"
        subtitle="One primary action to resolve the empty state"
        action={<KumikoButton>+ Add Item</KumikoButton>}
      />

      <EmptyState
        icon={<ClipboardIcon />}
        title="Multiple Actions"
        subtitle="Several options for getting started"
        action={
          <div className="flex gap-3">
            <KumikoButton variant="secondary">Import Menu</KumikoButton>
            <KumikoButton>+ Create New</KumikoButton>
          </div>
        }
      />

      <EmptyState
        icon={<SearchIcon />}
        title="Link Action"
        subtitle="Simple text link for secondary actions"
        action={
          <button className="text-kumiko-gray-500 hover:text-kumiko-gray-700 transition-colors text-sm underline">
            Browse templates
          </button>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different types of actions for empty states',
      },
    },
  },
};

// Contextual examples
export const ContextualExamples: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Dashboard widget */}
      <div className="bg-kumiko-white border border-kumiko-gray-100 rounded-base p-6">
        <h3 className="text-lg font-light text-kumiko-black mb-4">Recent Orders</h3>
        <EmptyState
          title="No recent orders"
          subtitle="Orders will appear here once customers start placing them"
          size="sm"
          variant="subtle"
        />
      </div>

      {/* Menu category */}
      <div className="bg-kumiko-white border border-dashed border-kumiko-gray-100 rounded-base p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-kumiko-black tracking-normal">Appetizers</h2>
        </div>
        <EmptyState
          icon={<PlusIcon />}
          title="No items in this category"
          subtitle="Start building your appetizers menu"
          action={<KumikoButton variant="secondary">+ Add Item</KumikoButton>}
          size="base"
        />
      </div>

      {/* Search results */}
      <div className="bg-kumiko-white border border-kumiko-gray-100 rounded-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-light text-kumiko-black">Search Results</h3>
          <span className="text-sm text-kumiko-gray-500">0 results for "sushi"</span>
        </div>
        <EmptyState
          icon={<SearchIcon />}
          title="No items found"
          subtitle="Try a different search term or browse all items"
          size="sm"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty states shown in different UI contexts',
      },
    },
  },
};