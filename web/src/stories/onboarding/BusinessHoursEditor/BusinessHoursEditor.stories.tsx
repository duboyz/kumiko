import type { Meta, StoryObj } from '@storybook/react'
import { BusinessHoursEditor, BusinessHours } from './BusinessHoursEditor'
import { useState } from 'react'

const meta = {
    title: 'Onboarding/BusinessHoursEditor',
    component: BusinessHoursEditor,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BusinessHoursEditor>

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to handle state
function BusinessHoursEditorWrapper({ weekdayText }: { weekdayText?: string[] }) {
    const [hours, setHours] = useState<BusinessHours | null>(null)

    return (
        <div>
            <BusinessHoursEditor weekdayText={weekdayText} onChange={setHours} />
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Current Business Hours (JSON):</h3>
                <pre className="text-sm">{JSON.stringify(hours, null, 2)}</pre>
            </div>
        </div>
    )
}

export const Default: Story = {
    args: {
        onChange: () => { },
    },
    render: () => <BusinessHoursEditorWrapper />,
}

export const WithGooglePlacesData: Story = {
    args: {
        onChange: () => { },
    },
    render: () => (
        <BusinessHoursEditorWrapper
            weekdayText={[
                'Monday: 9:00 AM – 5:00 PM',
                'Tuesday: 9:00 AM – 5:00 PM',
                'Wednesday: 9:00 AM – 5:00 PM',
                'Thursday: 9:00 AM – 5:00 PM',
                'Friday: 9:00 AM – 5:00 PM',
                'Saturday: Closed',
                'Sunday: Closed',
            ]}
        />
    ),
}

export const RestaurantHours: Story = {
    args: {
        onChange: () => { },
    },
    render: () => (
        <BusinessHoursEditorWrapper
            weekdayText={[
                'Monday: 11:00 AM – 10:00 PM',
                'Tuesday: 11:00 AM – 10:00 PM',
                'Wednesday: 11:00 AM – 10:00 PM',
                'Thursday: 11:00 AM – 11:00 PM',
                'Friday: 11:00 AM – 11:00 PM',
                'Saturday: 12:00 PM – 11:00 PM',
                'Sunday: 12:00 PM – 9:00 PM',
            ]}
        />
    ),
}

export const TwentyFourHourFormat: Story = {
    args: {
        onChange: () => { },
    },
    render: () => (
        <BusinessHoursEditorWrapper
            weekdayText={[
                'Monday: 08:00 – 20:00',
                'Tuesday: 08:00 – 20:00',
                'Wednesday: 08:00 – 20:00',
                'Thursday: 08:00 – 20:00',
                'Friday: 08:00 – 22:00',
                'Saturday: 10:00 – 22:00',
                'Sunday: 10:00 – 18:00',
            ]}
        />
    ),
}

