import { Box, ChakraProvider } from '@chakra-ui/react';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { FC, useEffect, useState } from 'react';
import { useUser } from 'store';
import { useLogin } from 'store/useLogin';
import { queryClient, theme } from 'utils';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [user, setUser] = useUser((e) => [e.user, e.setUser]);
  useEffect(() => {
    if (!user && typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_DETAILS) {
      setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));
    }
  }, [setUser, user]);

  let inactivityTimer;

  const { logout } = useLogin();

  const resetInactivityTimer = (): void => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(
      () => logout({ message: 'You have been logged out due to inactivity.' }),
      INACTIVITY_TIMEOUT
    );
  };

  const [isDevtoolsVisible, setIsDevtoolsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.host === 'localhost:3000') {
      setIsDevtoolsVisible(true);
    }
  }, []);
  useEffect(() => {
    if (user) {
      const handleActivity = (): void => resetInactivityTimer();
      const events = ['mousemove', 'keydown', 'scroll', 'click'];
      events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));
      resetInactivityTimer(); // Start the initial timer

      return (): void => {
        events.forEach((event) => window.removeEventListener(event, handleActivity));
        clearTimeout(inactivityTimer); // Clean up the timeout on unmount
      };
    }
  }, []);

  // Set up persistence
  const persister = createAsyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined, // Use localStorage
    key: 'QUX_QUERY_OFFLINE_CACHE',
  });
  persistQueryClient({
    queryClient,
    persister,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <main className={poppins.className}>
          <Box bg="black" height="auto" width="100vw" overflowX="hidden" suppressHydrationWarning>
            <Component {...pageProps} />
          </Box>
        </main>
        {isDevtoolsVisible && <ReactQueryDevtools />}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
