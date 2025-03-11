import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Blocks/Base/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    content: 'This is some example content for the card. It can be a short description or any text.',
    variant: 'default',
  },
};

export const WithImage: Story = {
  args: {
    title: 'Card with Image',
    subtitle: 'Featured content',
    content: 'This card includes an image at the top to make it more visually appealing.',
    imageUrl: 'https://via.placeholder.com/400x200',
    variant: 'elevated',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card with Footer',
    content: 'This card has a footer section with a button.',
    variant: 'outlined',
    footer: <Button variant="primary" size="sm" label="Learn More" />,
  },
};