import { HeroSectionType } from "@shared";
import { HeroSection } from "./HeroSection"
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
    component: HeroSection,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        heading: 'Welcome to Our Restaurant',
        text: 'Experience exceptional dining with our carefully crafted menu and warm atmosphere',
        buttonText: 'View Menu',
        buttonUrl: '#menu',
        buttonTextColor: '#ffffff',
        buttonBackgroundColor: '#ef4444',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        type: HeroSectionType.BackgroundImage,
    },
} satisfies Meta<typeof HeroSection>;

export default meta

export const BackgroundImage: StoryObj<typeof meta> = {
    args: {
        heading: 'Authentic Japanese Cuisine',
        text: 'Discover the art of traditional Japanese cooking with our chef\'s special selection',
        buttonText: 'Reserve Now',
        buttonUrl: '#reservation',
        buttonTextColor: '#ffffff',
        buttonBackgroundColor: '#dc2626',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
        type: HeroSectionType.BackgroundImage,
    },
}

export const DarkOverlay: StoryObj<typeof meta> = {
    args: {
        heading: 'Premium Dining Experience',
        text: 'Indulge in our signature dishes crafted with the finest ingredients',
        buttonText: 'Book Table',
        buttonUrl: '#booking',
        buttonTextColor: '#ffffff',
        buttonBackgroundColor: '#059669',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        overlayColor: '#000000',
        overlayOpacity: 0.7,
        type: HeroSectionType.BackgroundImage,
    },
}

export const ColoredOverlay: StoryObj<typeof meta> = {
    args: {
        heading: 'Modern Japanese Fusion',
        text: 'Where tradition meets innovation in every bite',
        buttonText: 'Explore Menu',
        buttonUrl: '#menu',
        buttonTextColor: '#ffffff',
        buttonBackgroundColor: '#7c3aed',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        overlayColor: '#1e40af',
        overlayOpacity: 0.3,
        type: HeroSectionType.BackgroundImage,
    },
}

export const LightOverlay: StoryObj<typeof meta> = {
    args: {
        heading: 'Fresh & Seasonal',
        text: 'Celebrating the best of each season with locally sourced ingredients',
        buttonText: 'View Seasonal Menu',
        buttonUrl: '#seasonal',
        buttonTextColor: '#1f2937',
        buttonBackgroundColor: '#f59e0b',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        overlayColor: '#ffffff',
        overlayOpacity: 0.2,
        type: HeroSectionType.BackgroundImage,
    },
}