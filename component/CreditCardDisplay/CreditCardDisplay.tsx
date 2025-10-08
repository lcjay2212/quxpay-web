import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';

interface CreditCardDisplayProps {
  cardNumber: string;
  cardType: string;
  expirationDate: string;
  nameOnCard: string;
  isDefault: boolean;
}

export const CreditCardDisplay: FC<CreditCardDisplayProps> = ({
  cardNumber,
  cardType,
  expirationDate,
  nameOnCard,
  isDefault,
}) => {
  // Mask card number - show only last 4 digits
  const maskedCardNumber = cardNumber ? cardNumber.replace(/\d(?=\d{4})/g, 'X') : 'XX XXXX XXXX XXXX';

  // Format expiration date from YYYYMM to MM/YY
  const formattedExpDate = expirationDate ? `${expirationDate.slice(2, 4)}/${expirationDate.slice(0, 2)}` : 'MM/YY';

  return (
    <Box
      bg="gray.800"
      borderRadius="2xl"
      p={6}
      position="relative"
      boxShadow="lg"
      mb={6}
      minH="200px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      mt="1rem"
    >
      {/* Top section with icon and default badge */}
      <Flex justifyContent="space-between" alignItems="flex-start" mb={4}>
        {/* Credit card icon */}
        <Image src="/assets/icons/credit-card-icon.webp" height={40} width={40} alt="Credit Card" placeholder="empty" />

        {/* Default card badge */}
        {isDefault && (
          <Box bg="teal.500" color="white" px={3} py={1} borderRadius="full" fontSize="sm" fontWeight="medium">
            Default Card
          </Box>
        )}
      </Flex>

      {/* Bottom section with card details */}
      <Box>
        {/* Card type */}
        <Text color="white" fontSize="lg" fontWeight="medium" mb={2} textTransform="capitalize">
          {cardType || 'Credit Card'}
        </Text>

        {/* Masked card number */}
        <Text color="white" fontSize="lg" fontWeight="medium" fontFamily="mono" letterSpacing="wide" mb={1}>
          {maskedCardNumber}
        </Text>

        {/* Expiration date */}
        <Text color="gray.300" fontSize="sm" fontWeight="normal">
          Expires {formattedExpDate}
        </Text>

        {/* Card holder name */}
        {nameOnCard && (
          <Text color="gray.300" fontSize="sm" fontWeight="normal" mt={1}>
            {nameOnCard}
          </Text>
        )}
      </Box>

      {/* Decorative elements */}
      <Box position="absolute" top={4} right={4} w={12} h={12} bg="whiteAlpha.100" borderRadius="full" opacity={0.3} />
      <Box position="absolute" bottom={4} right={4} w={8} h={8} bg="whiteAlpha.100" borderRadius="full" opacity={0.2} />
    </Box>
  );
};
