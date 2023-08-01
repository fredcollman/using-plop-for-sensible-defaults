import type { Meta, StoryObj } from "@storybook/react";

import FancyButton from ".";

const meta = {
  title: "components/FancyButton",
  component: FancyButton,
} satisfies Meta<typeof FancyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "example fancy button",
  },
};
