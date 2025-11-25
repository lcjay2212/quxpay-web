import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FC, RefObject } from 'react';

interface PuzzleContainerProps {
  containerRef: RefObject<HTMLDivElement>;
  draggableRef: RefObject<HTMLDivElement>;
  position: Position;
  imageUrl?: string;
  pieceUrl?: string;
  isVerifying: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

export const PuzzleContainer: FC<PuzzleContainerProps> = ({
  containerRef,
  draggableRef,
  position,
  imageUrl,
  pieceUrl,
  isVerifying,
  isDragging,
  onMouseDown,
  onTouchStart,
}) => {
  return (
    <Box
      ref={containerRef}
      position="relative"
      width={300}
      height={300}
      opacity={isVerifying ? 0.6 : 1}
      role="application"
      aria-label="Captcha puzzle area"
      tabIndex={0}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      border="3px solid"
      borderColor={isVerifying ? 'teal.400' : 'gray.300'}
      transition="all 0.3s"
      _hover={{ borderColor: 'teal.400' }}
      outline="none"
      _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)' }}
    >
      {isVerifying && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.300"
          zIndex={9999}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={3}
        >
          <Spinner color="white" size="xl" thickness="4px" speed="0.8s" />
          <Text color="white" fontWeight="bold" fontSize="sm">
            Verifying...
          </Text>
        </Flex>
      )}
      {imageUrl && <Image src={imageUrl} width={300} height={300} alt="Captcha Image" />}
      {pieceUrl && (
        <Box
          ref={draggableRef}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          position="absolute"
          cursor={isDragging ? 'grabbing' : 'grab'}
          transition="filter 0.2s"
          _hover={{ filter: 'brightness(1.1)' }}
          _active={{ filter: 'brightness(0.95)' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          aria-label="Draggable puzzle piece"
        >
          <Image src={pieceUrl} width={120} height={120} alt="Jigsaw Part Image" />
        </Box>
      )}
    </Box>
  );
};
