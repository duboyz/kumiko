import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TimeRangePicker } from './TimeRangePicker';

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Kumiko/Molecules/TimeRangePicker',
  component: TimeRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimalist time range picker for setting opening hours, following the Japanese-inspired onboarding prototype design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    openTime: {
      control: 'text',
      description: 'Opening time in HH:MM format',
    },
    closeTime: {
      control: 'text',
      description: 'Closing time in HH:MM format',
    },
    isClosed: {
      control: 'boolean',
      description: 'Whether the day is marked as closed',
    },
    dayLabel: {
      control: 'text',
      description: 'Label for the day of the week',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all interactions',
    },
  },
  args: {
    onTimeChange: fn(),
    onClosedToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    dayLabel: 'Monday',
    openTime: '09:00',
    closeTime: '22:00',
  },
};

export const Closed: Story = {
  args: {
    dayLabel: 'Sunday',
    openTime: '09:00',
    closeTime: '22:00',
    isClosed: true,
  },
};

export const CustomHours: Story = {
  args: {
    dayLabel: 'Friday',
    openTime: '11:30',
    closeTime: '23:30',
  },
};

export const WithoutLabel: Story = {
  args: {
    openTime: '10:00',
    closeTime: '20:00',
  },
};

export const Disabled: Story = {
  args: {
    dayLabel: 'Tuesday',
    openTime: '09:00',
    closeTime: '22:00',
    disabled: true,
  },
};

// Interactive week schedule
export const WeekSchedule: Story = {
  render: () => {
    const [schedule, setSchedule] = React.useState({
      Monday: { open: '09:00', close: '22:00', closed: false },
      Tuesday: { open: '09:00', close: '22:00', closed: false },
      Wednesday: { open: '09:00', close: '22:00', closed: false },
      Thursday: { open: '09:00', close: '22:00', closed: false },
      Friday: { open: '09:00', close: '23:00', closed: false },
      Saturday: { open: '10:00', close: '23:00', closed: false },
      Sunday: { open: '10:00', close: '21:00', closed: true },
    });

    const updateTime = (day: string, openTime: string, closeTime: string) => {
      setSchedule(prev => ({
        ...prev,
        [day]: { ...prev[day as keyof typeof prev], open: openTime, close: closeTime }
      }));
    };

    const toggleClosed = (day: string, isClosed: boolean) => {
      setSchedule(prev => ({
        ...prev,
        [day]: { ...prev[day as keyof typeof prev], closed: isClosed }
      }));
    };

    return (
      <div className="w-96 space-y-4">
        <h3 className="text-lg font-light text-kumiko-black text-center mb-6">
          Opening Hours
        </h3>

        <div className="border border-kumiko-gray-100 rounded-base p-4">
          {Object.entries(schedule).map(([day, times]) => (
            <TimeRangePicker
              key={day}
              dayLabel={day}
              openTime={times.open}
              closeTime={times.close}
              isClosed={times.closed}
              onTimeChange={(open, close) => updateTime(day, open, close)}
              onClosedToggle={(closed) => toggleClosed(day, closed)}
            />
          ))}
        </div>

        <div className="text-center text-sm text-kumiko-gray-500">
          Click the × to mark days as closed
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive weekly schedule with individual day controls',
      },
    },
  },
};

// Onboarding example
export const OnboardingExample: Story = {
  render: () => {
    const [hours, setHours] = React.useState({
      Monday: { open: '09:00', close: '22:00', closed: false },
      Tuesday: { open: '09:00', close: '22:00', closed: false },
      Wednesday: { open: '09:00', close: '22:00', closed: false },
      Thursday: { open: '09:00', close: '22:00', closed: false },
      Friday: { open: '09:00', close: '22:00', closed: false },
      Saturday: { open: '09:00', close: '22:00', closed: false },
      Sunday: { open: '09:00', close: '22:00', closed: true },
    });

    const updateTime = (day: string, openTime: string, closeTime: string) => {
      setHours(prev => ({
        ...prev,
        [day]: { ...prev[day as keyof typeof prev], open: openTime, close: closeTime }
      }));
    };

    const toggleClosed = (day: string, isClosed: boolean) => {
      setHours(prev => ({
        ...prev,
        [day]: { ...prev[day as keyof typeof prev], closed: isClosed }
      }));
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-ultra-light tracking-widest mb-5 font-kumiko text-kumiko-black">
              KUMIKO
            </h1>
            <p className="text-xs font-normal tracking-wide uppercase text-kumiko-gray-400 font-kumiko">
              Setup
            </p>
          </div>

          {/* Step title */}
          <h2 className="text-xl font-light tracking-tight font-kumiko text-kumiko-black">
            Opening hours
          </h2>

          {/* Hours schedule */}
          <div className="text-left">
            {Object.entries(hours).map(([day, times]) => (
              <TimeRangePicker
                key={day}
                dayLabel={day}
                openTime={times.open}
                closeTime={times.close}
                isClosed={times.closed}
                onTimeChange={(open, close) => updateTime(day, open, close)}
                onClosedToggle={(closed) => toggleClosed(day, closed)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-5 pt-8">
            <button className="px-6 py-3 text-kumiko-gray-700 font-kumiko font-normal text-base tracking-tighter hover:text-kumiko-gray-900 transition-colors">
              Back
            </button>
            <button className="px-6 py-4 bg-kumiko-black text-kumiko-white font-kumiko font-normal text-base tracking-tighter hover:bg-kumiko-gray-900 transition-colors">
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete onboarding step for setting opening hours matching the prototype',
      },
    },
  },
};

// Different time formats and use cases
export const TimeFormats: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Standard Hours</h4>
        <div className="border border-kumiko-gray-100 rounded-base p-3">
          <TimeRangePicker
            dayLabel="Weekday"
            openTime="09:00"
            closeTime="17:00"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Late Hours</h4>
        <div className="border border-kumiko-gray-100 rounded-base p-3">
          <TimeRangePicker
            dayLabel="Friday"
            openTime="17:00"
            closeTime="02:00"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Split Schedule</h4>
        <div className="border border-kumiko-gray-100 rounded-base p-3">
          <TimeRangePicker
            dayLabel="Lunch"
            openTime="11:30"
            closeTime="14:30"
          />
          <TimeRangePicker
            dayLabel="Dinner"
            openTime="17:30"
            closeTime="22:30"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-kumiko-gray-700 mb-3">Closed Day</h4>
        <div className="border border-kumiko-gray-100 rounded-base p-3">
          <TimeRangePicker
            dayLabel="Sunday"
            openTime="09:00"
            closeTime="22:00"
            isClosed={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different scheduling scenarios and time formats',
      },
    },
  },
};