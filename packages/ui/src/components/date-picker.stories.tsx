import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DatePicker } from "./date-picker";

const meta = {
  title: "Atoms/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => {
    const [value, setValue] = useState(new Date());

    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onChange: () => {} } };

export const Disabled: Story = {
  args: { disabled: true, onChange: () => {} },
};
