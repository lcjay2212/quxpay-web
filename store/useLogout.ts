import { API_SESSION_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { clearStorage, notify, queryClient } from 'utils';
import { useUser } from './useUser';

export const useLogout = (): { logout: ({ message }: { message?: string }) => Promise<void> } => {
  const router = useRouter();
  const setUser = useUser((e) => e.setUser);

  const logout = async ({ message }: { message: string }): Promise<void> => {
    try {
      const loginSession = await fetch(`${API_SESSION_URL}/api/logout`);
      const json = await loginSession.json();

      if (json.success) {
        clearStorage(); // Clear storage
        setUser(null); // Set user to null
        notify(message);

        // Ensure the user is null before removing queries and redirecting
        await router.push('/'); // Await the router redirection

        // After redirect, safely remove queries
        queryClient.clear();
      } else {
        // TODO: Handle failure (e.g., show error notification)
        notify('Logout failed. Please try again.');
      }
    } catch (error) {
      // Handle any potential errors with the fetch
      notify('An error occurred during logout.');
    }
  };

  return { logout };
};
