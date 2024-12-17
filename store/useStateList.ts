import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { clearStorage, notify } from 'utils';

export const useStateList = (): any => {
  return useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/states`, {
          headers: {
            Version: 2,
          },
        });

        const states = data.data.map((item) => {
          return { label: `${item.name}`, value: `${item.value}` };
        });
        return states;
      } catch (error) {
        if (error.response.status === 401) {
          clearStorage();
          window.location.href = '/';
          notify(error.message, { status: 'error' });
        }
      }
    },
  });
};
