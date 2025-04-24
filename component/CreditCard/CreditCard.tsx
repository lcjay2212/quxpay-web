import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

export const CreditCard: FC<{ accountNumber: string; cardType: string; loading: boolean }> = ({
  accountNumber,
  loading,
  cardType,
}) => (
  <>
    {!loading ? (
      <Flex gap={4} justifyContent="center" alignItems="center" color="white">
        <Image src="/assets/icons/credit-card-icon.webp" height={50} width={50} placeholder="empty" alt="Qux Wallet" />
        <Box fontSize="lg" textAlign="start">
          <Text>{cardType}</Text>
          <Text>Name: {accountNumber}</Text>
        </Box>
      </Flex>
    ) : (
      <>
        <Spinner />
      </>
    )}
  </>
);
