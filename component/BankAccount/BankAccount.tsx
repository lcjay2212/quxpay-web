import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { AddBankIcon } from 'public/assets';
import { FC } from 'react';

const BankAccount: FC<{ name?: string; accountNumber: string; loading: boolean }> = ({
  name,
  accountNumber,
  loading,
}) => (
  <>
    {!loading ? (
      <Flex gap={8} height="60px" color="white">
        <Box height={80}>
          <Image src={AddBankIcon} height={50} width={50} alt="Qux Wallet" />
        </Box>
        <Box fontSize="lg">
          <Text>{accountNumber}</Text>
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

export default BankAccount;
