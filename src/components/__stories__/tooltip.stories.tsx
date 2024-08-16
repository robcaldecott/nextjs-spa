import type { Meta } from "@storybook/react";
import { Button } from "../button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;

export const OnButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover for a tooltip</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Hello, world!</p>
      </TooltipContent>
    </Tooltip>
  );
};
