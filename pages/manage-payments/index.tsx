import { AddIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Container, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, SEO } from 'component';
import { FETCH_BANK_AND_CREDIT_DETAILS } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useDecryptedData } from 'store/useDecryptedData';
import { getServerSideProps } from 'utils';

// Interface for API data structure
interface CreditCardData {
  customerPaymentProfileId: string;
  defaultPaymentProfile: boolean;
  payment: {
    billingInfo: {
      address: string;
      city: string;
      country: string;
      firstName: string;
      lastName: string;
      state: string;
      zip: string;
    };
    creditCard: {
      cardNumber: string;
      expirationDate: string;
      cardType: string;
      nameOnCard: string;
    };
    payment_type: string;
  };
}

interface WalletBankData {
  customerPaymentProfileId: string;
  defaultPaymentProfile: string;
  payment_type: string;
  payment: {
    bankAccount: {
      accountType: string;
      accountNumber: string;
      routingNumber: string;
      nameOnAccount: string;
      echeckType: string;
      bank_name: string;
    };
  };
}

interface PaymentMethodData {
  id: string;
  type?: string;
  number?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  isDefault: boolean;
}

// Helper function to transform credit card data
const transformCreditCardData = (card: CreditCardData): PaymentMethodData => ({
  id: card.customerPaymentProfileId,
  type: card.payment.creditCard.cardType.replace(/'/g, ''),
  number: card.payment.creditCard.cardNumber.replace(/'/g, ''),
  accountHolder: card.payment.creditCard.nameOnCard,
  isDefault: card.defaultPaymentProfile,
});

// Helper function to transform bank account data from wallet
const transformWalletBankData = (bank: WalletBankData): PaymentMethodData => ({
  id: bank.customerPaymentProfileId,
  bankName: bank.payment.bankAccount.bank_name || 'Bank Account',
  accountNumber: bank.payment.bankAccount.accountNumber || '',
  accountHolder: bank.payment.bankAccount.nameOnAccount || '',
  isDefault: false,
});

const PaymentMethodCard: FC<{
  type: 'credit' | 'bank';
  data: PaymentMethodData;
  onEdit: () => void;
  buttonLabel?: string;
}> = ({ type, data, onEdit, buttonLabel = 'Edit' }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    py={4}
    px={4}
    borderBottom="1px solid"
    borderColor="gray.300"
    transition="all 0.2s ease-in-out"
    _hover={{
      transform: 'translateX(4px)',
      borderLeft: '4px solid',
      borderLeftColor: 'teal.500',
    }}
  >
    <HStack spacing={4}>
      <Image
        src={type === 'credit' ? '/assets/icons/credit-card-icon.webp' : '/assets/icons/bank-icon.webp'}
        height={40}
        width={40}
        alt={type === 'credit' ? 'Credit Card' : 'Bank Account'}
        placeholder="empty"
      />
      <VStack align="start" spacing={1}>
        <Text color="gray.700" fontSize="lg" fontWeight="medium">
          {type === 'credit' ? data.type : data.bankName}
        </Text>
        {type === 'bank' && data.accountHolder && (
          <Text color="gray.600" fontSize="sm">
            {data.accountHolder}
          </Text>
        )}
        <Text color="gray.600" fontSize="sm">
          {type === 'credit' ? data.number : data.accountNumber}
        </Text>
        {data.isDefault && (
          <Badge colorScheme="teal" size="sm" variant="subtle">
            DEFAULT
          </Badge>
        )}
      </VStack>
    </HStack>
    <Button
      size="sm"
      variant="ghost"
      colorScheme="teal"
      onClick={onEdit}
      _hover={{
        bg: 'teal.100',
        color: 'teal.700',
        transform: 'scale(1.05)',
      }}
      transition="all 0.2s ease-in-out"
    >
      {buttonLabel}
    </Button>
  </Flex>
);

const AddNewCard: FC<{ type: 'credit' | 'bank'; onClick: () => void }> = ({ type, onClick }) => (
  <Flex
    justifyContent="flex-start"
    alignItems="center"
    py={4}
    px={4}
    cursor="pointer"
    borderRadius="md"
    transition="all 0.2s ease-in-out"
    _hover={{
      bg: 'teal.50',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '& .add-icon': {
        bg: 'teal.600',
        transform: 'scale(1.1)',
      },
      '& .add-text': {
        color: 'teal.700',
      },
      '& .add-description': {
        color: 'gray.600',
      },
    }}
    _active={{
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <HStack spacing={4}>
      <Box
        className="add-icon"
        w={12}
        h={12}
        borderRadius="full"
        bg="teal.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s ease-in-out"
      >
        <AddIcon color="white" boxSize={6} />
      </Box>
      <VStack align="start" spacing={1}>
        <Text
          className="add-text"
          color="teal.600"
          fontSize="lg"
          fontWeight="semibold"
          transition="color 0.2s ease-in-out"
        >
          {type === 'credit' ? 'Add New Card' : 'Add Bank Account'}
        </Text>
      </VStack>
    </HStack>
  </Flex>
);

const ManagePayments: FC = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['bandAndCreditDetails'],
    queryFn: FETCH_BANK_AND_CREDIT_DETAILS,
  });

  const { data: wallet, dataLoading: walletLoading } = useDecryptedData('wallets');

  // Transform API data
  const creditCards = data?.credit_card?.map(transformCreditCardData) || [];
  const bankAccounts = wallet?.banks?.bank.map(transformWalletBankData) || [];

  const handleEditCard = (cardId: string): void => {
    void router.push(`/manage-payments/credit-card/edit?id=${cardId}`);
  };

  const handleViewBank = (bankId: string): void => {
    void router.push(`/manage-payments/bank/details?id=${bankId}`);
  };

  const handleAddCard = (): void => {
    void router.push('/manage-payments/credit-card/add');
  };

  const handleAddBank = (): void => {
    void router.push('/manage-payments/bank/add'); // Assuming this route exists
  };

  return (
    <HeaderContainer label="Manage Payments" route="/dashboard">
      <Box bg="black" minH="100vh" color="white">
        <SEO page="manage-payments" />

        <Container maxW="container.sm" px={4} py={4}>
          {/* Credit / Debit Card Section */}
          <Box mb={8}>
            <Heading as="h2" fontSize="lg" color="white" mb={4}>
              Credit / Debit Card
            </Heading>
            <Box bg="gray.200" borderRadius="lg" overflow="hidden">
              {isLoading ? (
                <Box p={4} textAlign="center">
                  <Text color="gray.600">Loading credit cards...</Text>
                </Box>
              ) : creditCards.length > 0 ? (
                creditCards.map((card) => (
                  <PaymentMethodCard
                    key={card.id}
                    type="credit"
                    data={card}
                    onEdit={(): void => handleEditCard(card.id)}
                  />
                ))
              ) : (
                <Box p={4} textAlign="center">
                  <Text color="gray.600">No credit cards found</Text>
                </Box>
              )}
              <AddNewCard type="credit" onClick={handleAddCard} />
            </Box>
          </Box>

          {/* Bank Account Section */}
          <Box mb={8}>
            <Heading as="h2" fontSize="lg" color="white" mb={4}>
              Bank Account
            </Heading>
            <Box bg="gray.200" borderRadius="lg" overflow="hidden">
              {walletLoading ? (
                <Box p={4} textAlign="center">
                  <Text color="gray.600">Loading bank accounts...</Text>
                </Box>
              ) : bankAccounts.length > 0 ? (
                bankAccounts.map((bank) => (
                  <PaymentMethodCard
                    key={bank.id}
                    type="bank"
                    data={bank}
                    onEdit={(): void => handleViewBank(bank.id)}
                    buttonLabel="View"
                  />
                ))
              ) : (
                <Box p={4} textAlign="center">
                  <Text color="gray.600">No bank accounts found</Text>
                </Box>
              )}
              <AddNewCard type="bank" onClick={handleAddBank} />
            </Box>
          </Box>
        </Container>

        {/* Footer indicator */}
        <Box
          position="fixed"
          bottom={0}
          left="50%"
          transform="translateX(-50%)"
          w="40px"
          h="4px"
          bg="white"
          borderRadius="2px"
        />
      </Box>
    </HeaderContainer>
  );
};

export { getServerSideProps };
export default ManagePayments;
