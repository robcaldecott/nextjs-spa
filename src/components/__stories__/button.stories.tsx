import type { Meta, StoryObj } from "@storybook/react";
import { Heart } from "lucide-react";
import { Button } from "../button";

const meta = {
  title: "Button",
  component: Button,
  args: {
    variant: "default",
    size: "default",
    children: "Button",
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Icon: Story = {
  args: {
    size: "icon",
    children: <Heart />,
  },
};
