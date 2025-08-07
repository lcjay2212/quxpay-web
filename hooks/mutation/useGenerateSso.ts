import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { navigateWithNewTab } from 'utils';
import api from 'utils/api';

interface GenerateSsoRequest {
  route: string;
}

interface GenerateSsoResponse {
  ssoData: {
    key: string;
  };
  route: string;
}

export const useGenerateSso = (): {
  generateSso: UseMutationResult<GenerateSsoResponse, Error, GenerateSsoRequest>;
} => {
  const router = useRouter();

  const generateSso = useMutation({
    mutationKey: ['generate-sso'],
    mutationFn: async (variables: GenerateSsoRequest) => {
      const { data } = await api.post('web/generate/sso');
      return { ssoData: data.data, route: variables.route };
    },
    onSuccess: (data) => {
      const routeWithSso = `${data.route}?sso=${data.ssoData.key}`;
      navigateWithNewTab(routeWithSso, router);
    },
  });

  return { generateSso };
};
