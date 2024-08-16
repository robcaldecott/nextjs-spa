import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "../pagination";

const meta = {
  title: "Pagination",
  component: Pagination,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem variant="summary">
          <PaginationSummary page={2} totalPages={3} />
        </PaginationItem>
        <PaginationItem variant="button">
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem variant="button">
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
