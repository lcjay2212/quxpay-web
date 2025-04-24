import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

export const CryptoWallet: FC<{ name?: string; address: string; type: string; loading: boolean }> = ({
  name,
  address,
  loading,
  type,
}) => (
  <>
    {!loading ? (
      <Flex gap={4} height="60px" textAlign="start" color="white">
        <Box height={80}>
          <Image src="/assets/icons/crypto-icon.webp" height={50} width={50} placeholder="empty" alt="Qux Wallet" />
        </Box>
        <Box fontSize="lg">
          <Text noOfLines={1}>
            <span>{name}</span>&nbsp;
            {address.slice(0, 12)}...
          </Text>
          <Text>Name: {type}</Text>
        </Box>
      </Flex>
    ) : (
      <>
        <Spinner />
      </>
    )}
  </>
);
