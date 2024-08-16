import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../skeleton";

const meta = {
  title: "Skeleton",
  component: Skeleton,
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    className: "h-4 w-[250px] rounded-sm",
  },
};

export const Round: Story = {
  args: {
    className: "h-12 w-12 rounded-full",
  },
};
