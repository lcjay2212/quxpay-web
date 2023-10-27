import { globalFonts } from 'constants/globalFonts';
import { COLORS as colors } from './colors';
export const STYLED_CONFIG = {
  global: {
    '@fontFace': globalFonts,
    'html, body': {
      background: colors.dark,
      overflowX: 'hidden',
      scrollBehaviour: 'smooth',
      width: '100vw',
      fontFamily: "'Verdana', sans-serif",
    },
  },
};
