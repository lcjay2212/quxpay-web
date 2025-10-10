import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { BankAccountDisplay, DeleteBankModal, HeaderContainer } from 'component';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useDecryptedData } from 'store/useDecryptedData';
import { useDeleteBankModal } from 'store/useDeleteBankModal';

interface WalletBankData {
  customerPaymentProfileId: string;
  defaultPaymentProfile?: boolean;
  payment_type: string;
  payment: {
    bankAccount: {
      accountType?: string;
      accountNumber: string;
      routingNumber: string;
      nameOnAccount: string;
      echeckType?: string;
      bank_name: string;
    };
  };
  account_name?: string;
}

const BankDetailsPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const openDeleteModal = useDeleteBankModal((e) => e.openModal);
  const { data: wallet, dataLoading } = useDecryptedData('wallets');

  // Find the specific bank account to view
  const currentBank = wallet?.banks?.bank?.find((bank: WalletBankData) => bank.customerPaymentProfileId === id) as
    | WalletBankData
    | undefined;

  const handleDelete = (): void => {
    if (!id) return;
    openDeleteModal(id as string);
  };

  if (dataLoading) {
    return (
      <HeaderContainer label="Bank Account Details" route="/manage-payments">
        <Flex h="90vh" justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary" />
        </Flex>
      </HeaderContainer>
    );
  }

  if (!currentBank) {
    return (
      <HeaderContainer label="Bank Account Details" route="/manage-payments">
        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <Text color="red.500">Bank account not found</Text>
          <Button
            mt={4}
            onClick={(): void => {
              void router.push('/manage-payments');
            }}
          >
            Back to Manage Payments
          </Button>
        </Box>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer label="Bank Account Details" route="/manage-payments">
      <>
        {/* Bank Account Display */}
        <Box px="1rem" mb="2rem">
          <BankAccountDisplay
            bankName={currentBank.payment.bankAccount.bank_name}
            accountNumber={currentBank.payment.bankAccount.accountNumber}
            routingNumber={currentBank.payment.bankAccount.routingNumber}
            accountHolder={currentBank.payment.bankAccount.nameOnAccount}
            accountNickname={currentBank.account_name}
          />
        </Box>

        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <Flex flexDirection="column" gap={4}>
            <Button variant="delete" borderRadius="1rem" h="3.25rem" onClick={handleDelete}>
              Delete Bank Account
            </Button>

            <Button
              variant="outline"
              borderRadius="1rem"
              h="3.25rem"
              onClick={(): void => {
                void router.push('/manage-payments');
              }}
            >
              Back to Manage Payments
            </Button>
          </Flex>
        </Box>

        <DeleteBankModal />
      </>
    </HeaderContainer>
  );
};

export default BankDetailsPage;
