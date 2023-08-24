import { Box, ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from 'utils/theme';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Box bg="black" height="100vh" width="100vw" overflow="hidden">
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
