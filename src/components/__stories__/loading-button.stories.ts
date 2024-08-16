import type { Meta, StoryObj } from "@storybook/react";
import { LoadingButton } from "../loading-button";

const meta = {
  title: "LoadingButton",
  component: LoadingButton,
  args: {
    loading: true,
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
} satisfies Meta<typeof LoadingButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
