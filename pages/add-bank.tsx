import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AddBankAccount, HeaderContainer } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { usePendingBankAccountVerificationModal } from 'store';
import { useDecryptedData } from 'store/useDecryptedData';
import { notify } from 'utils';
import { encryptData } from 'utils/encryptData';

const AddBankAccountPage: FC = () => {
  const router = useRouter();
  const { data: wallet, dataLoading } = useDecryptedData('wallets');
  const setVerificationVisible = usePendingBankAccountVerificationModal(({ setVisible }) => setVisible);

  const methods = useForm();
  const { handleSubmit } = methods;

  const { mutate: updateMainFile, isPending: isUpdating } = useMutation({
    mutationKey: ['updateMainFile'],
    mutationFn: async (variable) => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/encryption/updated/main-file`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      });
    },

    onSuccess: () => {
      notify('Successfully added a new account.');
      setTimeout(() => {
        router.push('/dashboard');
        setVerificationVisible(true);
      }, 3000);
    },
    onError: ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message, { status: 'error' });
    },
  });

  const { mutate: validate, isPending } = useMutation({
    mutationKey: ['validate'],
    mutationFn: async (variable) => {
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
      const encryptedData = encryptData(JSON.stringify(content), core, 'wallets');

      updateMainFile(encryptedData as any);
    },

    onError: ({ response }: any) => {
      const { errors } = response?.data || {};
      let message = '';

      if (errors) {
        Object.values(errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    validate({ ...val, payment_type: 'ach_bank' });
  };

  return (
    <HeaderContainer label="Add Account" route="/dashboard" hasMenu>
      {!dataLoading ? (
        <Box mx="1rem" h="100vh">
          <Flex alignItems="center" mb="1rem">
            <Image src="/assets/icons/add-bank-icon.webp" height={40} width={50} alt="Add Bank Icon" />
            <Text ml="1rem" color="white" fontSize="1.25rem">
              Add New Bank Account
            </Text>
          </Flex>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddBankAccount />
              <Flex mt="2rem" flexDirection="column">
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  h="3.25rem"
                  isLoading={isPending || isUpdating}
                >
                  Add Account
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </Box>
      ) : (
        <Flex h="90vh" justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary" />
        </Flex>
      )}
    </HeaderContainer>
  );
};

export default AddBankAccountPage;
