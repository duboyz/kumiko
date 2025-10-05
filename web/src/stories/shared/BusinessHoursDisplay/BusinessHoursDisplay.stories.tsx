import type { Meta, StoryObj } from '@storybook/react'
import { BusinessHoursDisplay } from './index'

const meta: Meta<typeof BusinessHoursDisplay> = {
    title: 'Shared/BusinessHoursDisplay',
    component: BusinessHoursDisplay,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleBusinessHours = JSON.stringify({
    monday: { open: "12:00", close: "20:00" },
    tuesday: { open: "12:00", close: "20:00" },
    wednesday: { open: "12:00", close: "20:00" },
    thursday: { open: "12:00", close: "20:00" },
    friday: { open: "12:00", close: "20:00" },
    saturday: { open: "14:00", close: "20:00" },
    sunday: null
})

export const Default: Story = {
    args: {
        businessHours: sampleBusinessHours,
        isOpenNow: true,
    },
}

export const Closed: Story = {
    args: {
        businessHours: sampleBusinessHours,
        isOpenNow: false,
    },
}

export const NoStatus: Story = {
    args: {
        businessHours: sampleBusinessHours,
        isOpenNow: null,
    },
}

export const NoBusinessHours: Story = {
    args: {
        businessHours: null,
        isOpenNow: null,
    },
}

export const DifferentHours: Story = {
    args: {
        businessHours: JSON.stringify({
            monday: { open: "09:00", close: "17:00" },
            tuesday: { open: "09:00", close: "17:00" },
            wednesday: { open: "09:00", close: "17:00" },
            thursday: { open: "09:00", close: "17:00" },
            friday: { open: "09:00", close: "17:00" },
            saturday: { open: "10:00", close: "14:00" },
            sunday: null
        }),
        isOpenNow: false,
    },
}

export const RestaurantHours: Story = {
    args: {
        businessHours: JSON.stringify({
            monday: { open: "11:00", close: "22:00" },
            tuesday: { open: "11:00", close: "22:00" },
            wednesday: { open: "11:00", close: "22:00" },
            thursday: { open: "11:00", close: "22:00" },
            friday: { open: "11:00", close: "23:00" },
            saturday: { open: "11:00", close: "23:00" },
            sunday: { open: "12:00", close: "21:00" }
        }),
        isOpenNow: true,
    },
}

export const MixedHours: Story = {
    args: {
        businessHours: JSON.stringify({
            monday: { open: "11:00", close: "20:00" },
            tuesday: { open: "11:00", close: "20:00" },
            wednesday: { open: "11:00", close: "20:00" },
            thursday: { open: "11:00", close: "20:00" },
            friday: { open: "11:00", close: "21:00" },
            saturday: { open: "13:00", close: "20:00" },
            sunday: null
        }),
        isOpenNow: true,
    },
}
