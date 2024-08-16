import type { Meta, StoryObj } from "@storybook/react";
import { AppLoading } from "../app-loading";

const meta = {
  title: "AppLoading",
  component: AppLoading,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppLoading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
