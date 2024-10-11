import Button from '../../src/components/ui/Button.astro';
import "../../src/assets/css/index.scss";

export default {
  component: Button,
}

export const Basic = {
  args: {
    children: 'Button',
  },
};
 
export const Link = {
  args: {
    as: 'a',
    href: 'https://google.com',
    children: 'Link',
  },
}

export const Secondary = {
  args: {
    class: 'button_type-secondary',
    children: 'Button Secondary',
  },
}

export const Icon = {
  args: {
    class: 'button_type-icon',
    children: `
      <svg role="presentation" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  },
}

export const Large = {
  args: {
    class: 'button_size-large',
    children: 'Button Large',
  },
}

export const Fullwidth = {
  args: {
    class: 'button_fullwidth',
    children: 'Button Fullwidth',
  },
}