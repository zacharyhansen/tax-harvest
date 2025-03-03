import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { DateRangePicker } from './date-range-picker';

const meta = {
  title: 'Atoms/Calendar Date Picker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: () => {},
    value: { from: new Date(new Date().getFullYear(), 0, 1), to: new Date() },
  },
  render: ({ value: date }) => {
    // eslint-disable-next-line sonarjs/pluginRules-of-hooks
    const [selectedDateRange, setSelectedDateRange] = useState(date);

    return (
      <DateRangePicker
        value={selectedDateRange}
        onChange={setSelectedDateRange}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    onChange: () => {},
    value: { from: undefined },
  },
  render: ({ value: date }) => {
    // eslint-disable-next-line sonarjs/pluginRules-of-hooks
    const [selectedDateRange, setSelectedDateRange] = useState(date);

    return (
      <DateRangePicker
        value={selectedDateRange}
        onChange={setSelectedDateRange}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    onChange: () => {},
    value: { from: undefined },
    disabled: true,
  },
  render: args => {
    // eslint-disable-next-line sonarjs/pluginRules-of-hooks
    const [selectedDateRange, setSelectedDateRange] = useState(args.value);

    return (
      <DateRangePicker
        {...args}
        value={selectedDateRange}
        onChange={setSelectedDateRange}
      />
    );
  },
};
