import type { Meta, StoryObj } from '@storybook/react'
import { BusinessDetailsEditor, BusinessDetails } from './BusinessDetailsEditor'
import { useState } from 'react'
import type { ResponseBusinessDetails } from '@shared'

const meta = {
    title: 'Onboarding/BusinessDetailsEditor',
    component: BusinessDetailsEditor,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BusinessDetailsEditor>

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to handle state
function BusinessDetailsEditorWrapper({ businessData }: { businessData?: ResponseBusinessDetails }) {
    const [details, setDetails] = useState<BusinessDetails | null>(null)

    return (
        <div>
            <BusinessDetailsEditor businessData={businessData} onChange={setDetails} />
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Current Business Details (JSON):</h3>
                <pre className="text-sm">{JSON.stringify(details, null, 2)}</pre>
            </div>
        </div>
    )
}

const mockGooglePlacesData: ResponseBusinessDetails = {
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'The Italian Kitchen',
    formattedAddress: '123 Main Street, Oslo, 0150, Norway',
    formattedPhoneNumber: '+47 22 33 44 55',
    internationalPhoneNumber: '+47 22 33 44 55',
    website: 'https://italiankitchen.no',
    businessStatus: 'OPERATIONAL',
    types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
    rating: 4.5,
    userRatingsTotal: 234,
    priceLevel: 2,
    vicinity: 'Oslo',
    openingHours: {
        openNow: true,
        weekdayText: [
            'Monday: 11:00 AM – 10:00 PM',
            'Tuesday: 11:00 AM – 10:00 PM',
            'Wednesday: 11:00 AM – 10:00 PM',
            'Thursday: 11:00 AM – 11:00 PM',
            'Friday: 11:00 AM – 11:00 PM',
            'Saturday: 12:00 PM – 11:00 PM',
            'Sunday: 12:00 PM – 9:00 PM',
        ],
    },
    geometry: {
        location: {
            lat: 59.9139,
            lng: 10.7522,
        },
    },
    photos: [],
    reviews: [],
}

export const Empty: Story = {
    args: {
        onChange: () => { },
    },
    render: () => <BusinessDetailsEditorWrapper />,
}

export const WithGooglePlacesData: Story = {
    args: {
        onChange: () => { },
    },
    render: () => <BusinessDetailsEditorWrapper businessData={mockGooglePlacesData} />,
}

export const MinimalData: Story = {
    args: {
        onChange: () => { },
    },
    render: () => (
        <BusinessDetailsEditorWrapper
            businessData={{
                placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
                name: 'Small Cafe',
                formattedAddress: '456 Side Street, Bergen',
                formattedPhoneNumber: '',
                internationalPhoneNumber: '',
                website: '',
                businessStatus: 'OPERATIONAL',
                types: ['cafe'],
                rating: undefined,
                userRatingsTotal: undefined,
                priceLevel: undefined,
                vicinity: 'Bergen',
                openingHours: undefined,
                geometry: {
                    location: {
                        lat: 60.3913,
                        lng: 5.3221,
                    },
                },
                photos: [],
                reviews: [],
            }}
        />
    ),
}

