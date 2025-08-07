import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { notify } from 'utils';
import api from 'utils/api';
import { useUploadLoadingModal } from '../../store/useUploadLoadingModal';

interface UploadTransactionsRequest {
  file: File;
}

export const useUploadTransactions = (): {
  uploadTransactions: UseMutationResult<any, any, UploadTransactionsRequest>;
} => {
  const setVisible = useUploadLoadingModal((set) => set.setVisible);

  const uploadTransactions = useMutation({
    mutationKey: ['upload-transactions'],
    mutationFn: async (variables: UploadTransactionsRequest) => {
      const formData = new FormData();
      formData.append('file', variables.file);

      const response = await api.post('web/corporate/upload/transactions', formData);
      return response.data;
    },
    onSuccess: () => {
      notify('Upload success!');
      setVisible(false);
    },
    onError: ({ response }: any) => {
      notify(`${response.data?.data.format}`, { status: 'error' });
      setVisible(false);
    },
  });

  return { uploadTransactions };
};
