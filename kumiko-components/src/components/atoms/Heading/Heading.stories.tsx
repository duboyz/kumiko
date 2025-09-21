import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    level: 'h1',
    children: 'This is a Heading 1',
  },
};

export const H2: Story = {
  args: {
    level: 'h2',
    children: 'This is a Heading 2',
  },
};

export const H3: Story = {
  args: {
    level: 'h3',
    children: 'This is a Heading 3',
  },
};

export const H4: Story = {
  args: {
    level: 'h4',
    children: 'This is a Heading 4',
  },
};

export const H5: Story = {
  args: {
    level: 'h5',
    children: 'This is a Heading 5',
  },
};

export const H6: Story = {
  args: {
    level: 'h6',
    children: 'This is a Heading 6',
  },
};

export const CustomWeight: Story = {
  args: {
    level: 'h2',
    weight: 'bold',
    children: 'Bold Heading',
  },
};

export const SemanticOverride: Story = {
  args: {
    level: 'h1',
    as: 'h3',
    children: 'Looks like H1 but renders as H3',
  },
};