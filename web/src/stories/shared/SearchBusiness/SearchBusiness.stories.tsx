import type { Meta, StoryObj } from '@storybook/react'
import SearchBusiness from './SearchBusiness'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ResponseBusinessDetails } from '@shared'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

const meta = {
  title: 'Shared/SearchBusiness',
  component: SearchBusiness,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Search Business Component

A search component that allows users to find and select their business using Google Places API.

## Features

- **Real-time Search**: Search for businesses by name and location
- **Business Details**: Shows name, address, rating, phone, website, and business types
- **Visual Selection**: Selected business is highlighted with a ring and badge
- **Keyboard Support**: Press Enter to search
- **Error Handling**: Displays error messages if search fails

## Usage

This component is used during restaurant onboarding to help users find their business.

## Note

This story requires a running backend API with Google Places API integration.
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <div className="max-w-4xl mx-auto p-6">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof SearchBusiness>

export default meta
type Story = StoryObj<typeof meta>

export const Documentation: Story = {
  args: {
    onBusinessSelect: (business: ResponseBusinessDetails) => console.log('Selected:', business),
    selectedBusiness: null,
  },
  parameters: {
    docs: {
      description: {
        story: `
## SearchBusiness Component

This is a documentation-only story. The SearchBusiness component requires a live backend API with Google Places integration.

### Props

- \`onBusinessSelect\`: (business: ResponseBusinessDetails) => void - Callback when a business is selected
- \`selectedBusiness\`: ResponseBusinessDetails | null - Currently selected business (optional)

### Features Included

1. **Search Input** - Type business name and location, press Enter or click Search
2. **Business Cards** - Display search results with:
   - Name and address
   - Rating and review count
   - Phone number and website
   - Business types (restaurant, cafe, etc.)
3. **Visual Selection** - Selected business is highlighted with ring and "Selected" badge
4. **Loading States** - Shows spinner while searching
5. **Error Handling** - Displays error messages

### To Use This Component

Run the application and navigate to the restaurant onboarding flow:
\`\`\`
/onboarding/restaurant
\`\`\`

The component will allow you to search for and select your restaurant.

### Example Business Object

\`\`\`typescript
{
  placeId: "ChIJ...",
  name: "Pizza Express",
  formattedAddress: "123 Main St, Oslo, Norway",
  rating: 4.5,
  userRatingsTotal: 250,
  formattedPhoneNumber: "+47 22 33 44 55",
  website: "https://pizzaexpress.no",
  types: ["restaurant", "food", "point_of_interest"]
}
\`\`\`
        `,
      },
    },
  },
  render: (args) => (
    <div className="space-y-6">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">SearchBusiness Component</h2>
        <p className="text-gray-600 mb-6">
          This component requires a live backend API with Google Places integration. Please run the full application to see it in action.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">To Test This Component:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Start the backend API: <code className="bg-blue-100 px-2 py-1 rounded">cd BackendApi && dotnet run</code></li>
              <li>Start the frontend: <code className="bg-blue-100 px-2 py-1 rounded">pnpm dev</code></li>
              <li>Navigate to <code className="bg-blue-100 px-2 py-1 rounded">/onboarding/restaurant</code></li>
            </ol>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li>Google Places API integration</li>
              <li>Real-time business search</li>
              <li>Visual selection with highlighting</li>
              <li>Business details display (rating, phone, website)</li>
              <li>Keyboard support (Enter to search)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">Component Preview (Non-functional)</h3>
        <SearchBusiness {...args} />
      </div>
    </div>
  ),
}

export const WithSelectedBusiness: Story = {
  args: {
    onBusinessSelect: (business: ResponseBusinessDetails) => console.log('Selected:', business),
    selectedBusiness: {
      placeId: 'ChIJ123456789',
      name: 'Pizza Express Oslo',
      formattedAddress: '123 Karl Johans gate, 0162 Oslo, Norway',
      rating: 4.5,
      userRatingsTotal: 250,
      formattedPhoneNumber: '+47 22 33 44 55',
      internationalPhoneNumber: '+47 22 33 44 55',
      website: 'https://pizzaexpress.no',
      businessStatus: 'OPERATIONAL',
      types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
      vicinity: 'Karl Johans gate, Oslo',
      geometry: {
        location: {
          lat: 59.9139,
          lng: 10.7522,
        },
      },
      photos: [],
      reviews: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the component with a pre-selected business. The selected business card will be highlighted.',
      },
    },
  },
  render: (args) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4">Component with Selected Business</h3>
      <p className="text-sm text-gray-600 mb-4">
        This shows how the component looks with a business already selected. Note: Search functionality requires backend API.
      </p>
      <SearchBusiness {...args} />
    </div>
  ),
}
