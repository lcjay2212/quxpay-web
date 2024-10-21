import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { post } from 'constants/api';
import storage from 'constants/storage';
import { useRouter } from 'next/router';
import { clearStorage, notify, queryClient } from 'utils';
import { usePendingAccountModal } from './usePendingAccountModal';
import { useRouteParams } from './useRouteParams';
import { useUser } from './useUser';

export const useLogin = (): { login: UseMutationResult; logout: () => void } => {
  const router = useRouter();
  const params = useRouteParams((e) => e.params);
  const setUser = useUser((e) => e.setUser);
  const setVisible = usePendingAccountModal((e) => e.setVisible);

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: (variable) => post('web/login', variable),
    onSuccess: async ({ data }) => {
      notify(`${data.status.message}`);

      // const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${data.data.token}`);
      // const json = await loginSession.json();

      // if (json.success) {
      //   sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
      //   sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
      //   setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));
      // } else {
      //   throw new Error('Something went wrong');
      // }
      sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
      sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
      setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));

      const redirectUrl = params?.t ? '/checkout' : '/dashboard';
      void router.push(redirectUrl);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      const message = response?.data?.data?.message;

      if (message === 'These credentials do not match our records.') {
        notify(response?.data?.data?.messages || message, { status: 'error' });
      } else if (message === 'Account pending.') {
        setVisible(true);
      } else {
        notify('These credentials do not match our records.', { status: 'error' });
      }
    },
  });

  const logout = async (): Promise<void> => {
    clearStorage(); // Clear storage
    notify('Successfully Logout');
    setUser(null);
    await router.push('/');
    queryClient.clear();
    // try {
    //   const loginSession = await fetch(`${API_SESSION_URL}/api/logout`);
    //   const json = await loginSession.json();

    //   if (json.success) {
    //     clearStorage(); // Clear storage
    //     notify('Successfully Logout');
    //     setUser(null); // Set user to null

    //     // Ensure the user is null before removing queries and redirecting
    //     await router.push('/'); // Await the router redirection

    //     // After redirect, safely remove queries
    //     queryClient.clear();
    //   } else {
    //     // TODO: Handle failure (e.g., show error notification)
    //     notify('Logout failed. Please try again.');
    //   }
    // } catch (error) {
    //   // Handle any potential errors with the fetch
    //   notify('An error occurred during logout.');
    // }
  };

  return { login, logout };
};
