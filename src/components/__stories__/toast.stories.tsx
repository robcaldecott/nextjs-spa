import type { Meta } from "@storybook/react";
import { toast } from "sonner";
import { Button } from "../button";
import { Toaster } from "../toaster";

const meta = {
  title: "Toast",
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta;

export default meta;

export function Success() {
  return <Button onClick={() => toast.success("Success!")}>Toast</Button>;
}

export function Error() {
  return <Button onClick={() => toast.error("Error!")}>Toast</Button>;
}

export function Cancel() {
  return (
    <Button
      onClick={() =>
        toast.success("With cancel button", {
          description: "Description",
          cancel: {
            label: "Cancel",
            onClick: () => {},
          },
        })
      }
    >
      Toast
    </Button>
  );
}
