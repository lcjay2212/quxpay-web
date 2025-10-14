import { Button, Flex, Input, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useDecryptedData } from 'store/useDecryptedData';
import { useDeleteBankModal } from 'store/useDeleteBankModal';
import { notify } from 'utils';
import { encryptData } from 'utils/encryptData';

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

export const DeleteBankModal: FC = () => {
  const router = useRouter();
  const [visible, setVisible, bankId] = useDeleteBankModal((e) => [e.visible, e.setVisible, e.bankId]);
  const [confirmText, setConfirmText] = useState('');
  const isConfirmValid = confirmText === 'CONFIRM';
  const { data: wallet } = useDecryptedData('wallets');

  const { mutate: updateMainFile, isPending: isUpdating } = useMutation({
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
      notify('Bank Account Deleted Successfully', { status: 'success' });
      setVisible(false);
      setConfirmText('');
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
      notify(message || errorData?.status?.message || 'Failed to delete bank account', { status: 'error' });
    },
  });

  const { mutate: deleteBankAccount, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteBankAccount'],
    mutationFn: async () => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/validate/remove-credit-card-or-bank-account`,
        { payment_profile_id: bankId, payment_type: 'ach_bank' },
        {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
            Version: 2,
          },
        }
      );

      const content = {
        delete_bank_accounts: [{ payment_profile_id: bankId, payment_type: 'ach_bank' }],
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
      notify(message || errorData?.status?.message || 'Failed to delete bank account', { status: 'error' });
    },
  });

  const handleDelete = (): void => {
    if (isConfirmValid) {
      deleteBankAccount();
    }
  };

  const handleClose = (): void => {
    setVisible(false);
    setConfirmText('');
  };

  const isPending = isDeleting || isUpdating;

  return (
    <Modal isOpen={visible} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="teal.500" mx="1rem" borderRadius="2xl" maxW="400px" boxShadow="2xl">
        <ModalBody p={0} overflow="hidden">
          {/* Red header band */}
          <Flex bg="red.500" w="full" minH="16" alignItems="center" justifyContent="center" px={6} py={4}>
            <Text
              fontSize="1.1rem"
              fontWeight="bold"
              textAlign="center"
              textTransform="uppercase"
              color="white"
              lineHeight="1.2"
            >
              Are you sure you want to Delete this Bank Account?
            </Text>
          </Flex>

          {/* Main content */}
          <Flex flexDir="column" color="white" alignItems="center" px={8} py={8} gap={6}>
            {/* Instruction text */}
            <Text fontSize="1.1rem" textAlign="center" fontWeight="medium" color="white" lineHeight="1.4">
              Please type "CONFIRM" below to proceed.
            </Text>

            {/* Input field */}
            <Input
              value={confirmText}
              onChange={(e): void => setConfirmText(e.target.value)}
              bg="white"
              color="black"
              borderRadius="xl"
              h="3.5rem"
              fontSize="1.1rem"
              fontWeight="medium"
              textAlign="center"
              border="none"
              boxShadow="sm"
              w="full"
              _placeholder={{
                color: 'gray.400',
                fontWeight: 'normal',
              }}
              _focus={{
                boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.3)',
                border: 'none',
              }}
            />

            {/* Buttons */}
            <Flex flexDir="column" w="full" gap={3}>
              <Button
                bg={isConfirmValid ? 'red.500' : 'gray.300'}
                color={isConfirmValid ? 'white' : 'gray.500'}
                h="3.5rem"
                borderRadius="xl"
                fontSize="1.1rem"
                fontWeight="bold"
                textTransform="uppercase"
                isDisabled={!isConfirmValid}
                isLoading={isPending}
                onClick={handleDelete}
                border="none"
                _hover={{
                  bg: isConfirmValid ? 'red.600' : 'gray.300',
                  transform: isConfirmValid ? 'translateY(-1px)' : 'none',
                  boxShadow: isConfirmValid ? 'lg' : 'none',
                }}
                _active={{
                  bg: isConfirmValid ? 'red.700' : 'gray.300',
                  transform: 'translateY(0px)',
                }}
                _disabled={{
                  bg: 'gray.300',
                  color: 'gray.500',
                  cursor: 'not-allowed',
                  transform: 'none',
                  boxShadow: 'none',
                }}
                transition="all 0.2s ease"
              >
                Delete
              </Button>

              <Button
                bg="white"
                color="black"
                h="3.5rem"
                borderRadius="xl"
                fontSize="1.1rem"
                fontWeight="medium"
                border="2px solid"
                borderColor="gray.200"
                onClick={handleClose}
                isDisabled={isPending}
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.300',
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                _active={{
                  bg: 'gray.100',
                  transform: 'translateY(0px)',
                }}
                transition="all 0.2s ease"
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
