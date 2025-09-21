import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
        },
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        required: {
            control: 'boolean',
        },
    },
    args: {
        onChange: fn(),
        onFocus: fn(),
        onBlur: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithValue: Story = {
    args: {
        placeholder: 'Enter text...',
        defaultValue: 'Hello World',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Enter your email...',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password...',
    },
};

export const Number: Story = {
    args: {
        type: 'number',
        placeholder: 'Enter a number...',
    },
};

export const Search: Story = {
    args: {
        type: 'search',
        placeholder: 'Search...',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'This input is disabled',
        disabled: true,
    },
};

export const Required: Story = {
    args: {
        placeholder: 'This field is required',
        required: true,
    },
};

export const WithLabel: Story = {
    render: (args) => (
        <div className="space-y-2">
            <label htmlFor="input-with-label" className="text-sm font-medium">
                Label
            </label>
            <Input {...args} id="input-with-label" />
        </div>
    ),
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithError: Story = {
    render: (args) => (
        <div className="space-y-2">
            <label htmlFor="input-with-error" className="text-sm font-medium">
                Email
            </label>
            <Input {...args} id="input-with-error" className="border-red-500 focus-visible:ring-red-500" />
            <p className="text-sm text-red-500">Please enter a valid email address</p>
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Enter your email...',
        defaultValue: 'invalid-email',
    },
};

export const Large: Story = {
    args: {
        placeholder: 'Large input...',
        className: 'h-12 text-lg',
    },
};

export const Small: Story = {
    args: {
        placeholder: 'Small input...',
        className: 'h-8 text-sm',
    },
};
