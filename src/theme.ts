import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        // height: '100%',
        bg: '#F3F3F3',
      },
      'html,body,#__next': {
        // minHeight: '100vh',
      },
    },
  },
});

export default theme;
