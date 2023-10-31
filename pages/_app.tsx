import { Box, ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { theme } from 'utils/theme';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Box bg="black" height="auto" width="100vw" overflowX="hidden">
          <Component {...pageProps} suppressHydrationWarning />
        </Box>
        {typeof window !== 'undefined' && window.location.host === 'localhost:3000' && (
          <ReactQueryDevtools position="bottom-right" />
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
