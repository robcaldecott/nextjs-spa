import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../select";

const meta = {
  title: "Select",
  component: Select,
  args: {
    defaultValue: "",
    disabled: false,
    children: (
      <>
        <option value="" disabled>
          Select a fruit
        </option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </>
    ),
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
