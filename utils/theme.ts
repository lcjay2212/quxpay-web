import { extendTheme } from '@chakra-ui/react';
import { STYLED_CONFIG as styles } from './styles';
import { COLORS as colors } from './styles/colors';
import { components } from './styles/components';

export const theme = extendTheme({
  colors,
  components,
  styles,
});
