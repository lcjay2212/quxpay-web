import { Box, Text } from '@chakra-ui/react';
import { FC } from 'react';

export const CaptchaHeader: FC = () => {
  return (
    <Box w="100%" bg="teal.600" py={4} px={6}>
      <Text color="white" fontSize="xl" fontWeight="bold" textAlign="center">
        🔒 Security Verification
      </Text>
      <Text color="teal.100" fontSize="sm" textAlign="center" mt={1}>
        Complete the puzzle to continue
      </Text>
    </Box>
  );
};
