import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

export const BankAccount: FC<{ name?: string; accountNumber?: string; bankName?: string; loading?: boolean }> = ({
  name,
  accountNumber,
  loading,
  bankName,
}) => (
  <>
    {!loading ? (
      <Flex gap={4} height="60px" textAlign="start" color="white">
        <Image src="/assets/icons/bank-icon.webp" height={50} width={50} placeholder="empty" alt="Qux Wallet" />
        <Box fontSize="lg">
          <Text noOfLines={1}>
            <span>{bankName}</span>&nbsp;
            {accountNumber}
          </Text>
          <Text>Name: {name}</Text>
        </Box>
      </Flex>
    ) : (
      <>
        <Spinner />
      </>
    )}
  </>
);
