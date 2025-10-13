import type { Meta, StoryObj } from '@storybook/react'
import { SavingsCalculator } from './SavingsCalculator'

const meta: Meta<typeof SavingsCalculator> = {
  title: 'Landing/SavingsCalculator',
  component: SavingsCalculator,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive calculator showing cost savings compared to competitors. Features a slider to adjust monthly revenue and displays real-time calculations of platform fees and savings.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SavingsCalculator>

export const Default: Story = {
  args: {},
}

export const WithCustomRevenue: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'The calculator starts with a default revenue of 50,000 NOK. Users can slide to adjust from 10,000 to 500,000 NOK to see how savings scale with revenue.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
## How to Use This Component

1. **Scroll to Animate**: The slider automatically adjusts as you scroll through the section
2. **Manual Control**: You can still manually adjust the slider if desired
3. **Compare Costs**: See side-by-side comparison of competitor fees vs Kumiko
4. **View Savings**: The bottom card shows exactly how much you save per month and year

## Key Features

- **Scroll-Triggered Animation**: Revenue automatically increases from 50k to 200k as you scroll
- **Real-time Calculations**: Updates instantly as values change
- **Elegant Design**: Sophisticated gray color scheme with subtle gradients
- **Visual Comparison**: Clean cards showing competitor vs Kumiko pricing
- **Currency Formatting**: Properly formatted Norwegian Kroner (NOK)
- **Responsive Design**: Works on all device sizes
- **GSAP Animations**: Smooth entrance animations and scroll-triggered interactions

## Business Impact

This component demonstrates Kumiko's value proposition by showing:
- Competitors take 30% of revenue (massive cut)
- Kumiko charges only 500 NOK fixed fee (fair pricing)
- Potential savings scale with business size
- Clear ROI calculation for decision makers
- Interactive experience that keeps users engaged
        `,
      },
    },
  },
}

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'The calculator is fully responsive and works great on mobile devices. Cards stack vertically on smaller screens.',
      },
    },
  },
}

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'On tablet devices, the comparison cards display side-by-side for easy comparison.',
      },
    },
  },
}
