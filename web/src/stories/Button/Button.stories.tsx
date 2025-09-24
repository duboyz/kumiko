import { formatNumber } from '@/lib/utils';
import { Button } from './Button'
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};

