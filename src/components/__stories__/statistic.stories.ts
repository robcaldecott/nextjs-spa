import type { Meta, StoryObj } from "@storybook/react";
import { Statistic } from "../statistic";

const meta = {
  title: "Statistic",
  component: Statistic,
  args: {
    label: "Label",
    value: "Value",
  },
} as Meta<typeof Statistic>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
