'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Toaster } from '@repo/ui/components/sonner';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { Cat, Dog, Fish, Rabbit, Turtle } from 'lucide-react';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import CheckboxField from './fields/checkbox.field';
import ComboboxMultiField from './fields/combobox-multi.field';
import ComboboxField from './fields/combobox.field';
import DatePickerField from './fields/date-picker.field';
import DateRangePickerField from './fields/date-range-picker.field';
import InputField from './fields/input.field';
import PasswordInputField from './fields/password-input.field';
import PhoneInputField from './fields/phone-input.field';
import SliderField from './fields/slider.field';

import SwitchField from './fields/switch.field';
import TextareaField from './fields/textarea.field';
import TiptapBasicField from './fields/tiptap-minimal-field';

const formSchema = z.object({
  name_7152014886: z.boolean().default(true).optional(),
  name_9359847824: z.string().optional(),
  name_1463101423: z.string().optional(),
  name_7292896262: z.array(z.string()).nonempty('Please at least one item'),
  name_4857646071: z.string().optional(),
  name_4133530872: z.string().optional(),
  name_8308954598: z.coerce.date(),
  name_6650333345: z.string().optional(),
  name_6914029254: z.number().optional(),
  name_4680007971: z.coerce.date().optional(),
  name_6102846122: z.boolean().optional(),
  name_8429457173: z.string().optional(),
  name_1463101428: z.number().optional(),
  name_8308954599: z.object({ from: z.coerce.date(), to: z.coerce.date() }),
  name_8427457173: z.string(),
});

const meta = {
  title: 'Molecules/Form',
  args: {
    children: 'Shadcn',
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<object>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllFields: Story = {
  args: {},
  render: () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name_8308954598: new Date(),
        name_4680007971: new Date(),
        name_1463101423: 'RTER',
        name_1463101428: 2,
        name_9359847824: 'react',
        name_8308954599: {
          from: new Date(),
        },
        name_6914029254: 50,
        name_7292896262: ['react'],
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        console.info(values);
        toast(
          <pre className="mt-2 w-[340px] rounded-lg bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>,
        );
      } catch (error) {
        console.error('Form submission error', error);
        toast.error('Failed to submit the form. Please try again.');
      }
    }

    return (
      <TooltipProvider>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-3xl space-y-8 py-10"
          >
            <Toaster />

            <InputField
              name="name_1463101423"
              label="Text Field"
              description="This is your public display name."
            />

            <InputField
              name="name_1463101428"
              label="Number Field"
              description="This is your public display name."
              type="number"
            />

            <CheckboxField
              name="name_7152014886"
              label="Checkbox"
              description="Description for my checbox field."
            />

            <ComboboxField
              name="name_9359847824"
              label="Combobox Field"
              description="This is used when a user is selecting a single value."
              options={[
                { value: 'react', label: 'React' },
                { value: 'angular', label: 'Angular' },
                { value: 'vue', label: 'Vue' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'ember', label: 'Ember' },
              ]}
            />

            <ComboboxMultiField
              name="name_7292896262"
              label="Combobox Multi Field"
              description="This is used when a user is selecting multiple values."
              options={[
                { value: 'react', label: 'React', icon: Turtle },
                { value: 'angular', label: 'Angular', icon: Cat },
                { value: 'vue', label: 'Vue', icon: Dog },
                { value: 'svelte', label: 'Svelte', icon: Rabbit },
                { value: 'ember', label: 'Ember', icon: Fish },
              ]}
            />

            <DatePickerField
              name="name_8308954598"
              label="Date Picker Field"
              description="This is a date field."
            />

            <DateRangePickerField
              name="name_8308954599"
              label="Date Range Picker Field"
              description="This is a date range picker field."
            />

            <PasswordInputField
              name="name_4857646071"
              label="Password Input Field"
              description="This input shows and hides a password."
            />

            <PhoneInputField
              name="name_4133530872"
              label="Phone Input Field"
              description="Input to enter phone numbers."
            />

            <SliderField
              name="name_6914029254"
              label="Slider Field"
              description="Used when you want a visual numerical input that is bounded."
              min={0}
              max={100}
              step={5}
            />

            <SwitchField
              name="name_6102846122"
              label="Switch Field"
              description="Used when you are trying to capture a boolean value that is not required"
            />

            <TextareaField
              name="name_8429457173"
              label="Textarea Field"
              description="Textarea allows for long form text and resizing."
            />

            <TiptapBasicField
              name="name_8427457173"
              label="Tiptap Basic Field"
              description="Tiptap allows for a rich text editing expeirence in the form. Nodes can be moved around etc."
              placeholder="Start typing..."
            />

            <Button
              disabled={!form.formState.isDirty}
              type="submit"
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </FormProvider>
      </TooltipProvider>
    );
  },
};
