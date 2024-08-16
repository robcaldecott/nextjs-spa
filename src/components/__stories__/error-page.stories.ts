import type { Meta, StoryObj } from "@storybook/react";
import { ErrorPage } from "../error-page";

const meta = {
  title: "ErrorPage",
  component: ErrorPage,
} satisfies Meta<typeof ErrorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    message: "Something went wrong",
  },
};
