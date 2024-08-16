import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";
import { Label } from "../label";

const meta = {
  title: "Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextField: Story = {
  render: () => (
    <div className="space-y-1">
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
  ),
};
