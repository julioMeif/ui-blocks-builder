import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ButtonModern } from './ButtonModern';
import { ButtonCorporate } from './ButtonCorporate';
import { ButtonCreative } from './ButtonCreative';

const meta: Meta = {
  title: 'Blocks/Base/Buttons',
  tags: ['autodocs'],
  component: ButtonModern,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'accent'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    animated: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonModern>;

export default meta;

export const Modern: StoryObj<typeof ButtonModern> = {
  args: {
    variant: 'primary',
    size: 'md',
    animated: false,
    children: 'Modern Button',
  },
  render: (args) => <ButtonModern {...args} />,
  parameters: {
    businessType: ['Services', 'Portfolio', 'Personal Website', 'Consulting', 'Professional Services', 'Educational'],
    style: ['Modern & Professional', 'Minimal & Elegant', 'Clean & Simple', 'Sophisticated & Refined'],
  },
};

export const Corporate: StoryObj<typeof ButtonCorporate> = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Corporate Button',
  },
  render: (args) => <ButtonCorporate {...args} />,
  parameters: {
    businessType: ['Consulting', 'Sales Portal', 'Professional Services', 'Educational', 'Services'],
    style: ['Corporate & Serious', 'Sophisticated & Refined', 'Modern & Professional'],
    features: ['Booking System', 'Contact Form'],
  },
};

export const Creative: StoryObj<typeof ButtonCreative> = {
  args: {
    variant: 'accent',
    size: 'md',
    animated: true,
    children: 'Creative Button',
  },
  render: (args) => <ButtonCreative {...args} />,
  parameters: {
    businessType: ['Blog', 'Portfolio', 'Personal Website', 'Educational', 'Other'],
    style: ['Bold & Creative', 'Playful & Fun', 'Artistic & Expressive'],
    features: ['Newsletter Integration', 'Blog functionality', 'Other'],
  },
};