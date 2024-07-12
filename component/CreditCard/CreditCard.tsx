import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { BankIcon2 } from 'public/assets';
import { FC } from 'react';

const CreditCard: FC<{ accountNumber: string; cardType: string; loading: boolean }> = ({
  accountNumber,
  loading,
  cardType,
}) => (
  <>
    {!loading ? (
      <Flex gap={8} height="60px" textAlign="start" color="white">
        <Box height={80}>
          <Image src={BankIcon2} height={50} width={50} placeholder="empty" alt="Qux Wallet" />
        </Box>
        <Box fontSize="lg">
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
