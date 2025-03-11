import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Blocks/Composite/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  argTypes: {
    alignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    height: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
    },
    backgroundOverlay: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    title: 'Welcome to Our Platform',
    subtitle: 'The next generation solution',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl.',
    alignment: 'center',
    height: 'medium',
    ctaButtons: [
      {
        label: 'Get Started',
        variant: 'primary',
      },
      {
        label: 'Learn More',
        variant: 'outline',
      },
    ],
  },
};

export const WithBackground: Story = {
  args: {
    title: 'Discover Amazing Features',
    subtitle: 'Powerful and intuitive',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.',
    backgroundImage: 'https://via.placeholder.com/1920x1080',
    backgroundOverlay: true,
    alignment: 'left',
    height: 'large',
    ctaButtons: [
      {
        label: 'Try Now',
        variant: 'primary',
      },
    ],
  },
};

export const Minimal: Story = {
  args: {
    title: 'Simple and Clean',
    alignment: 'center',
    height: 'small',
    ctaButtons: [
      {
        label: 'Contact Us',
        variant: 'secondary',
      },
    ],
  },
};