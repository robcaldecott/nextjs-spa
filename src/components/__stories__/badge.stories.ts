import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";

const meta = {
  title: "Badge",
  component: Badge,
  args: {
    variant: "default",
    children: "Badge",
  },
  argTypes: {
    variant: {
      options: ["default", "secondary", "destructive", "outline"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
