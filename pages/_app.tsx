import { Box, ChakraProvider } from '@chakra-ui/react';
import { Poppins } from '@next/font/google';
import { AppProps } from 'next/app';
import { FC, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useUser } from 'store/useUser';
import { theme } from 'utils/theme';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();
  const [user, setUser] = useUser((e) => [e.user, e.setUser]);

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && localStorage.QUX_PAY_USER_DETAILS) {
      setUser(JSON.parse(localStorage.QUX_PAY_USER_DETAILS));
    }
  }, [setUser, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <main className={poppins.className}>
          <Box bg="black" height="auto" width="100vw" overflowX="hidden" suppressHydrationWarning>
            <Component {...pageProps} />
          </Box>
        </main>
        {typeof window !== 'undefined' && window.location.host === 'localhost:3000' && (
          <ReactQueryDevtools position="bottom-right" />
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
