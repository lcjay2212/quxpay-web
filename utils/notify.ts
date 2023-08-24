import { createStandaloneToast } from '@chakra-ui/toast';

const { toast } = createStandaloneToast();

export const notify = (
  title: string,
  options?: {
    status?: 'info' | 'warning' | 'error' | 'success';
  }
): void => {
  toast.closeAll();
  toast({ position: 'top', status: 'success', title, isClosable: true, duration: 3000, ...options });
};
