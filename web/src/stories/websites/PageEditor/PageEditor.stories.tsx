import type { Meta, StoryObj } from '@storybook/react'
import { PageEditor } from './PageEditor'

const meta = {
  title: 'Websites/PageEditor',
  component: PageEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Website Page Editor

A comprehensive WYSIWYG page builder for creating and managing website pages.

## Features

- **Drag & Drop Reordering**: Easily reorder sections by dragging them
- **Real-time Preview**: Toggle between edit and preview modes
- **Multiple Section Types**: Hero, Text, and Menu sections
- **Keyboard Shortcuts**: Ctrl+S to save, Esc to cancel
- **Optimistic Updates**: Instant UI feedback before server response
- **Toast Notifications**: Clear feedback for all actions
- **Visual Feedback**: Hover states, drag overlays, and editing indicators

## Usage

The PageEditor component is a complete page editing experience that handles:
- Section creation (Hero, Text, Restaurant Menu)
- Section editing with real-time WYSIWYG updates
- Section reordering via drag & drop
- Section deletion
- Preview mode for viewing the final result

## Note

This story requires a running backend API to function properly. For demonstration purposes,
please use the actual application at \`/websites/{websiteId}/pages/{pageId}\`.

The component includes:
- Real-time data fetching with React Query
- Optimistic UI updates for instant feedback
- Full CRUD operations for sections
- Drag-and-drop functionality with @dnd-kit
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageEditor>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for demonstration
const mockWebsiteId = '123e4567-e89b-12d3-a456-426614174000'
const mockPageId = '123e4567-e89b-12d3-a456-426614174001'
const mockRestaurantId = '123e4567-e89b-12d3-a456-426614174002'

export const Documentation: Story = {
  args: {
    websiteId: mockWebsiteId,
    pageId: mockPageId,
    restaurantId: mockRestaurantId,
    onBack: () => console.log('Back clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
## PageEditor Component

This is a documentation-only story. The PageEditor component requires a live backend API connection.

### Props

- \`websiteId\`: string - The ID of the website
- \`pageId\`: string - The ID of the page to edit
- \`restaurantId\`: string | null - The ID of the restaurant (for menu sections)
- \`onBack\`: () => void - Callback when back button is clicked

### Features Included

1. **Drag & Drop Reordering** - Uses @dnd-kit for accessible drag-and-drop
2. **Keyboard Shortcuts**:
   - Ctrl/Cmd + S: Save the currently editing section
   - Esc: Cancel editing and discard changes
3. **Toast Notifications** - User feedback for all actions
4. **Optimistic Updates** - Instant UI feedback before server response
5. **Visual Feedback** - Hover states, editing indicators, drag overlays

### To Use This Component

Run the application and navigate to:
\`\`\`
/websites/{websiteId}/pages/{pageId}
\`\`\`

The component will load real data and allow full editing capabilities.
        `,
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">PageEditor Component</h2>
        <p className="text-gray-600 mb-6">
          This component requires a live backend API connection. Please run the full application to see it in action.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">To Test This Component:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Start the backend API: <code className="bg-blue-100 px-2 py-1 rounded">cd BackendApi && dotnet run</code></li>
              <li>Start the frontend: <code className="bg-blue-100 px-2 py-1 rounded">pnpm dev</code></li>
              <li>Navigate to a page editor route in your browser</li>
            </ol>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li>Drag & drop section reordering</li>
              <li>Real-time WYSIWYG editing</li>
              <li>Keyboard shortcuts (Ctrl+S, Esc)</li>
              <li>Toast notifications for user actions</li>
              <li>Optimistic UI updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
}
