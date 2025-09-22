import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator, type ProgressStep } from './ProgressIndicator';
import { KumikoButton } from '../../atoms/KumikoButton';

const meta: Meta<typeof ProgressIndicator> = {
  title: 'Kumiko/Molecules/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimalist progress indicator using dots to show step completion, following Japanese design principles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
    showLabels: {
      control: 'boolean',
      description: 'Show step titles as labels',
    },
    currentStep: {
      control: 'text',
      description: 'ID of the current active step (auto-calculates states)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample steps for stories
const sampleSteps: ProgressStep[] = [
  { id: 'business-type', title: 'Business Type', state: 'completed' },
  { id: 'basic-info', title: 'Basic Info', state: 'active' },
  { id: 'opening-hours', title: 'Opening Hours', state: 'pending' },
];

const onboardingSteps: ProgressStep[] = [
  { id: 'step-1', state: 'completed' },
  { id: 'step-2', state: 'active' },
  { id: 'step-3', state: 'pending' },
];

// Basic examples
export const Default: Story = {
  args: {
    steps: sampleSteps,
  },
};

export const WithLabels: Story = {
  args: {
    steps: sampleSteps,
    showLabels: true,
  },
};

export const WithCurrentStep: Story = {
  args: {
    steps: [
      { id: 'business-type', title: 'Business Type', state: 'pending' },
      { id: 'basic-info', title: 'Basic Info', state: 'pending' },
      { id: 'opening-hours', title: 'Opening Hours', state: 'pending' },
    ],
    currentStep: 'basic-info',
    showLabels: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress automatically calculated based on currentStep prop',
      },
    },
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Small</h3>
        <ProgressIndicator steps={onboardingSteps} size="sm" />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Base</h3>
        <ProgressIndicator steps={onboardingSteps} size="base" />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Large</h3>
        <ProgressIndicator steps={onboardingSteps} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different dot sizes for various use cases',
      },
    },
  },
};

// Orientation variations
export const OrientationVariations: Story = {
  render: () => (
    <div className="flex gap-16 items-center">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Horizontal</h3>
        <ProgressIndicator steps={sampleSteps} showLabels orientation="horizontal" />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Vertical</h3>
        <ProgressIndicator steps={sampleSteps} showLabels orientation="vertical" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal and vertical layout options',
      },
    },
  },
};

// Progress states
export const ProgressStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">All Pending</h3>
        <ProgressIndicator
          steps={[
            { id: '1', state: 'pending' },
            { id: '2', state: 'pending' },
            { id: '3', state: 'pending' },
          ]}
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">First Active</h3>
        <ProgressIndicator
          steps={[
            { id: '1', state: 'active' },
            { id: '2', state: 'pending' },
            { id: '3', state: 'pending' },
          ]}
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">Middle Active</h3>
        <ProgressIndicator
          steps={[
            { id: '1', state: 'completed' },
            { id: '2', state: 'active' },
            { id: '3', state: 'pending' },
          ]}
        />
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-kumiko-gray-700">All Completed</h3>
        <ProgressIndicator
          steps={[
            { id: '1', state: 'completed' },
            { id: '2', state: 'completed' },
            { id: '3', state: 'completed' },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different progress completion states',
      },
    },
  },
};

// Interactive example
export const InteractiveExample: Story = {
  render: () => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

    const steps = [
      { id: 'business-type', title: 'Business Type' },
      { id: 'basic-info', title: 'Basic Info' },
      { id: 'opening-hours', title: 'Opening Hours' },
    ];

    const processedSteps = steps.map((step, index) => ({
      ...step,
      state: index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'active' : 'pending'
    })) as ProgressStep[];

    const canGoNext = currentStepIndex < steps.length - 1;
    const canGoPrev = currentStepIndex > 0;

    return (
      <div className="text-center space-y-8">
        <ProgressIndicator
          steps={processedSteps}
          showLabels
        />

        <div className="text-kumiko-gray-700">
          Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
        </div>

        <div className="flex gap-4 justify-center">
          <KumikoButton
            variant="ghost"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={!canGoPrev}
          >
            Back
          </KumikoButton>
          <KumikoButton
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={!canGoNext}
          >
            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
          </KumikoButton>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive progress indicator with navigation controls',
      },
    },
  },
};

// Real-world onboarding example
export const OnboardingExample: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      {/* Progress at top */}
      <div className="mb-20">
        <ProgressIndicator
          steps={onboardingSteps}
          size="sm"
        />
      </div>

      {/* Current step content */}
      <div className="text-center space-y-12">
        <div>
          <h1 className="text-5xl font-ultra-light tracking-widest mb-5 font-kumiko text-kumiko-black">
            KUMIKO
          </h1>
          <p className="text-xs font-normal tracking-wide uppercase text-kumiko-gray-400 font-kumiko">
            Setup
          </p>
        </div>

        <h2 className="text-xl font-light tracking-tight font-kumiko text-kumiko-black">
          What type of business?
        </h2>

        <div className="space-y-4">
          <button className="w-full border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors text-center">
            Restaurant
          </button>
          <button className="w-full border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors text-center">
            Hotel
          </button>
          <button className="w-full border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors text-center">
            Street Food
          </button>
        </div>

        <div className="flex justify-center gap-5 pt-8">
          <KumikoButton variant="ghost" disabled>
            Back
          </KumikoButton>
          <KumikoButton>Continue</KumikoButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete onboarding page layout with progress indicator matching the prototype',
      },
    },
  },
};