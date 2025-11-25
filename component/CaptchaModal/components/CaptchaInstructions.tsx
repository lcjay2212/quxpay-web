import { Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';

export const CaptchaInstructions: FC = () => {
  return (
    <Box w="100%" px={6} py={4} bg="teal.50" borderBottom="1px" borderColor="teal.100">
      <Text fontSize="sm" color="black" fontWeight="medium" mb={2}>
        📋 How to solve:
      </Text>
      <Flex direction="column" gap={1}>
        <Text fontSize="xs" color="black">
          • <strong>Drag</strong> the puzzle piece to fit the missing area
        </Text>
        <Text fontSize="xs" color="black">
          • Use <strong>arrow keys</strong> (↑ ↓ ← →) for precise control
        </Text>
        <Text fontSize="xs" color="black">
          • Or use the <strong>sliders</strong> below the puzzle
        </Text>
      </Flex>
    </Box>
  );
};
