import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { AddCreditCardIcon } from 'public/assets';
import { FC } from 'react';

const CreditCard: FC<{ accountNumber: string; cardType: string; loading: boolean }> = ({
  accountNumber,
  loading,
  cardType,
}) => (
  <>
    {!loading ? (
      <Flex gap={8} justifyContent="center" alignItems="center" color="white">
        <Image src={AddCreditCardIcon} height={50} width={50} placeholder="empty" alt="Qux Wallet" />
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

export default CreditCard;
