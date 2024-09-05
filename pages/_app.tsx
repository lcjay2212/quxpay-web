import { Box, ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { API_SESSION_URL } from 'constants/url';
import { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useUser } from 'store';
import { clearStorage, notify, queryClient, theme } from 'utils';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [user, setUser] = useUser((e) => [e.user, e.setUser]);
  useEffect(() => {
    if (!user && typeof window !== 'undefined' && localStorage.QUX_PAY_USER_DETAILS) {
      setUser(JSON.parse(localStorage.QUX_PAY_USER_DETAILS));
    }
  }, [setUser, user]);

  const router = useRouter();
  let inactivityTimer;

  const logout = async (): Promise<void> => {
    const loginSession = await fetch(`${API_SESSION_URL}/api/logout`);
    const json = await loginSession.json();

    if (json.success) {
      clearStorage();
      notify('You have been logged out due to inactivity.');
      setUser(null);
      void router.push('/');
    } else {
      // TODO: handler
    }
  };

  const resetInactivityTimer = (): void => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
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
