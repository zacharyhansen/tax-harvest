import type { Meta, StoryObj } from "@storybook/react";
import type { ComboboxAsyncOption } from "./comboboxAsync";

import { useState } from "react";
import { ComboboxAsync } from "./comboboxAsync";

const frameworksList = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

const meta = {
  title: "Atoms/Combobox Async",
  component: ComboboxAsync,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    fetcher: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(frameworksList);
        }, 3000);
      });
    },
    placeholder: "Select frameworks",
    renderOption: (item: ComboboxAsyncOption) => <div>{item.label}</div>,
    getOptionValue: (item: ComboboxAsyncOption) => item.value,
    getDisplayValue: (item: ComboboxAsyncOption) => item.label,
    value: "",
    label: "Select frameworks",
    onChange: (value: string) => {
      console.info("onChange", value);
    },
  },
  render: (args) => {
    const [value, setValue] = useState<string>(args.value);

    return (
      <ComboboxAsync<ComboboxAsyncOption>
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
} satisfies Meta<typeof ComboboxAsync<ComboboxAsyncOption>>;

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
