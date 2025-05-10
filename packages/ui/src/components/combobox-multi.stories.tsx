import type { Meta, StoryObj } from "@storybook/react";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { useState } from "react";

import { ComboboxMulti } from "./combobox-multi";

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

const meta = {
  title: "Atoms/Combobox Multi",
  component: ComboboxMulti,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    options: frameworksList,
    onChange: () => {},
    value: ["react", "angular"],
    placeholder: "Select frameworks",
    variant: "inverted",
    animation: 2,
    maxCount: 3,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value);

    return <ComboboxMulti {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof ComboboxMulti>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
