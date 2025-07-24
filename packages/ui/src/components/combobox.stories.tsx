import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Combobox } from "./combobox";

const frameworksList = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

const meta = {
  title: "Atoms/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    options: frameworksList,
    value: "react",
    placeholder: "Select frameworks",
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);

    return (
      <Combobox
        {...args}
        onChange={(value) => {
          setValue(value);
        }}
        value={value}
      />
    );
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
