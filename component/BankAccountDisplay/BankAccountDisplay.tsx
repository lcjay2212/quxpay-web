import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

interface BankAccountDisplayProps {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolder: string;
  accountNickname?: string;
}

export const BankAccountDisplay: FC<BankAccountDisplayProps> = ({
  bankName,
  accountNumber,
  routingNumber,
  accountHolder,
  accountNickname,
}) => {
  // Mask account number (show last 4 digits)
  const maskedAccountNumber = accountNumber ? `****${accountNumber.slice(-4)}` : '****';
  // Mask routing number (show last 4 digits)
  const maskedRoutingNumber = routingNumber ? `****${routingNumber.slice(-4)}` : '****';

  return (
    <Box
      bg="gradient.primary"
      borderRadius="2xl"
      p={6}
      boxShadow="xl"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: 'linear(135deg, teal.400 0%, teal.600 100%)',
        opacity: 0.9,
        zIndex: 0,
      }}
    >
      <Flex direction="column" position="relative" zIndex={1} gap={4}>
        {/* Header with bank icon */}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap={3}>
            <Image src="/assets/icons/bank-icon.webp" height={40} width={40} alt="Bank Icon" />
            <Text color="white" fontSize="xl" fontWeight="bold">
              {bankName}
            </Text>
          </Flex>
        </Flex>

        {/* Account nickname */}
        {accountNickname && (
          <Text color="white" fontSize="sm" opacity={0.9}>
            {accountNickname}
          </Text>
        )}

        {/* Account number */}
        <Box>
          <Text color="white" fontSize="xs" opacity={0.7} mb={1}>
            Account Number
          </Text>
          <Text color="white" fontSize="2xl" fontWeight="bold" letterSpacing="wider">
            {maskedAccountNumber}
          </Text>
        </Box>

        {/* Routing number and account holder */}
        <Flex justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Text color="white" fontSize="xs" opacity={0.7} mb={1}>
              Routing Number
            </Text>
            <Text color="white" fontSize="md" fontWeight="medium">
              {maskedRoutingNumber}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text color="white" fontSize="xs" opacity={0.7} mb={1}>
              Account Holder
            </Text>
            <Text color="white" fontSize="md" fontWeight="medium" noOfLines={1}>
              {accountHolder}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
