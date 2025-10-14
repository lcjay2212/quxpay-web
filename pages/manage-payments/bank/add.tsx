import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AddBankAccount, HeaderContainer } from 'component';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDecryptedData } from 'store/useDecryptedData';
import { notify } from 'utils';
import { encryptData } from 'utils/encryptData';

interface BankAccountFormData {
  account_name: string;
  bank_name: string;
  routing_number: string;
  account_number: string;
}

interface AddBankAccountRequest extends BankAccountFormData {
  payment_type: string;
}

interface ApiErrorData {
  errors?: Record<string, string>;
  status?: {
    message: string;
  };
}

interface EncryptedData {
  file: string;
  encrypted_main_key: string | null;
  decrypted_main_key: string | null;
  iv: string;
  key: string;
  type: string;
}

const AddBankAccountPage: FC = () => {
  const methods = useForm<BankAccountFormData>();
  const router = useRouter();
  const { handleSubmit } = methods;
  const { data: wallet, dataLoading } = useDecryptedData('wallets');

  const { mutate: updateMainFile, isPending: isUpdatingMainFile } = useMutation({
    mutationKey: ['updateMainFile'],
    mutationFn: async (variable: EncryptedData) => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/encryption/updated/main-file`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      });
    },
    onSuccess: () => {
      notify('Successfully added a new bank account.', { status: 'success' });
      void router.push('/manage-payments');
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      let message = '';
      const errorData = error.response?.data;

      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || errorData?.status?.message || 'Failed to update main file', { status: 'error' });
    },
  });

  const { mutate: addBankAccount, isPending: isAddingBankAccount } = useMutation({
    mutationKey: ['addBankAccount'],
    mutationFn: async (variable: AddBankAccountRequest) => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/validate/add-bank-account`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      });

      const content = {
        added_bank_accounts: [variable],
      };
      const core = wallet?.initialData;

      if (!core) {
        throw new Error('Wallet data not available');
      }

      const encryptedData = encryptData(JSON.stringify(content), core, 'wallets');
      updateMainFile(encryptedData);
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorData = error.response?.data;
      let message = '';

      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || errorData?.status?.message || 'Failed to add bank account', { status: 'error' });
    },
  });

  const onSubmit = (val: BankAccountFormData): void => {
    const bankAccountData: AddBankAccountRequest = {
      ...val,
      payment_type: 'ach_bank',
    };
    addBankAccount(bankAccountData);
  };

  return (
    <HeaderContainer label="Add Bank Account" route="/manage-payments">
      {dataLoading ? (
        <Flex h="90vh" justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary" />
        </Flex>
      ) : (
        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddBankAccount />

              <Flex mt="2rem" flexDirection="column">
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  h="3.25rem"
                  isLoading={isAddingBankAccount || isUpdatingMainFile}
                  isDisabled={!wallet}
                >
                  Add Bank Account
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </Box>
      )}
    </HeaderContainer>
  );
};

export default AddBankAccountPage;
