import { PRIMARY } from './variants/buttons';

export const Button = {
  variants: {
    primary: PRIMARY,
  },
};

const Container = {
  variants: {
    thick: {
      maxWidth: '87.5rem',
      m: '0 auto',
      bg: 'white',
    },
    'account-detail': {
      p: '1rem',
      px: '1.5rem',
      minHeight: '82vh',
      maxHeight: '100vh',
      overflowY: 'auto',
      textAlign: 'justify',
    },
  },
};

const Text = {
  sizes: {
    xxs: {
      fontSize: '0.625rem',
    },
    xs: {
      fontSize: '0.75rem',
    },
    sm: {
      fontSize: '0.875rem',
    },
    md: {
      fontSize: '1rem',
    },
    lg: {
      fontSize: '1.125rem',
    },
    xl: {
      fontSize: '1.25rem',
    },
    xxl: {
      fontSize: '1.375rem',
    },
    '2xl': {
      fontSize: '1.5rem',
    },
    '3xl': {
      fontSize: '1.875rem',
    },
    '4xl': {
      fontSize: '2.25rem',
    },
    '5xl': {
      fontSize: '3rem',
    },
  },
  variants: {
    link: {
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.25s ease-in',
      _hover: {
        color: 'basecolor',
      },
    },
    submenu: {
      color: 'white',
      padding: '0.75rem',
      cursor: 'pointer',
      _hover: { color: 'buttons.primary.background', transition: '0.25s ease-in' },
    },
  },
};

const Heading = {
  ...Text.sizes,
  variants: {
    register: {
      fontSize: '1.75rem',
      textAlign: 'center',
      pb: '5',
      color: 'black',
    },
    'account-detail': {
      as: 'h4',
      marginBottom: '1.25rem',
      fontSize: '1.84615385em',
      fontWeight: 'normal',
    },
    'sub-heading': {
      as: 'h4',
      m: '2rem 0',
      mb: '1rem',
      p: '0 25px',
      fontWeight: 'normal',
      pos: 'relative',
      fontSize: '1.2rem',
      verticalAlign: 'middle',
      d: 'flex',
      _before: {
        content: "''",
        w: '6px',
        pos: 'absolute',
        bg: 'buttons.primary.background',
        top: '0',
        left: '0',
        bottom: '0',
      },
    },
  },
};

const Box = {
  ...Text.sizes,
};

export const components = {
  Button,
  Container,
  Heading,
  Text,
  Box,
};
