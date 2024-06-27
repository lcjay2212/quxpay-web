import { Box, ChakraProvider } from '@chakra-ui/react';
import { API_SESSION_URL } from 'constants/url';
import { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useUser } from 'store/useUser';
import { clearStorage } from 'utils/clearStorage';
import { notify } from 'utils/notify';
import { theme } from 'utils/theme';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = new QueryClient();
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
        {typeof window !== 'undefined' && window.location.host === 'localhost:3000' && (
          <ReactQueryDevtools position="bottom-right" />
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
