import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";

const meta = {
  title: "Input",
  component: Input,
  args: {
    disabled: false,
    placeholder: "",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
