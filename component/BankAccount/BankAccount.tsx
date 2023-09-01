import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { AddBankIcon } from 'public/assets';
import { FC } from 'react';

const BankAccount: FC<{ bankDetails?: any; loading: boolean }> = ({ bankDetails, loading }) => (
  <>
    {!loading ? (
      <>
        {bankDetails ? (
          <Flex gap={8} height="60px" color="white">
            <Box height={80}>
              <Image src={AddBankIcon} height={50} width={50} alt="Qux Wallet" />
            </Box>
            <Box fontSize="lg">
              <Text>{bankDetails?.accountNumber}</Text>
              <Text>Name: {bankDetails?.nameOnAccount}</Text>
            </Box>
          </Flex>
        ) : (
          <>No Bank Account </>
        )}
      </>
    ) : (
      <>
        <Spinner />
      </>
    )}
  </>
);

export default BankAccount;
