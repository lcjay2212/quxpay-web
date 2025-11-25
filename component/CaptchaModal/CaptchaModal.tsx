import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import {
  useCaptchaData,
  useCaptchaVerification,
  useDragHandling,
  useFocusManagement,
  useKeyboardHandling,
} from 'hooks';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useCaptchaModal, useVerifyOtp } from 'store';
import { clamp } from 'utils';
import { CaptchaHeader } from './components/CaptchaHeader';
import { CaptchaInstructions } from './components/CaptchaInstructions';
import { HorizontalSlider, VerticalSlider } from './components/CaptchaSliders';
import { PuzzleContainer } from './components/PuzzleContainer';

const CONTAINER_SIZE = 300;
const PIECE_SIZE = 120;

export const CaptchaModal: FC<{ label: 'login' | 'register' }> = ({ label }) => {
  const [visible, setVisible] = useCaptchaModal(({ visible, setVisible }) => [visible, setVisible]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const horizontalSliderRef = useRef<HTMLDivElement | null>(null);
  const verticalSliderRef = useRef<HTMLDivElement | null>(null);

  const setVerify = useVerifyOtp((e) => e.setVerify);
  const maxPosition = useMemo(() => CONTAINER_SIZE - PIECE_SIZE, []);

  const updatePosition = useCallback(
    (nextX: number, nextY: number) => {
      const clampedPosition = {
        x: clamp(nextX, 0, maxPosition),
        y: clamp(nextY, 0, maxPosition),
      };
      setPosition(clampedPosition);
    },
    [maxPosition]
  );

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const { data, isLoading, refetch, isRefetching } = useCaptchaData({ setVisible });

  const { verify, isVerifying } = useCaptchaVerification({
    label,
    setVisible,
    setVerify,
    resetPosition,
    refetch,
  });

  const { isDragging, startDragging } = useDragHandling({
    containerRef,
    draggableRef,
    updatePosition,
  });

  const { focusSlider } = useFocusManagement({
    containerRef,
    visible,
    isLoading,
    isRefetching,
  });

  useKeyboardHandling({
    position,
    updatePosition,
    focusSlider,
    horizontalSliderRef,
    verticalSliderRef,
    visible,
    isLoading,
    isRefetching,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startDragging(e.clientX, e.clientY);
    },
    [startDragging]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      startDragging(t.clientX, t.clientY);
    },
    [startDragging]
  );

  const handleVerify = useCallback(() => {
    verify({
      captcha_id: data?.captcha_id || '',
      x: position.x,
      y: position.y,
    });
  }, [verify, data?.captcha_id, position]);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent maxW="600px" mx={4} bg="transparent">
        <ModalBody p={0}>
          <Flex flexDir="column" alignItems="center" bg="white" boxShadow="2xl" overflow="hidden">
            <CaptchaHeader />

            {!isLoading && !isRefetching ? (
              <>
                <CaptchaInstructions />

                <Box w="100%" px={6} py={6}>
                  <Flex gap={3} justifyContent="center" alignItems="center">
                    <PuzzleContainer
                      containerRef={containerRef}
                      draggableRef={draggableRef}
                      position={position}
                      imageUrl={data?.image}
                      pieceUrl={data?.jigsaw_part_missing}
                      isVerifying={isVerifying}
                      isDragging={isDragging}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                    />

                    <VerticalSlider
                      position={position}
                      maxPosition={maxPosition}
                      verticalSliderRef={verticalSliderRef}
                      updatePosition={updatePosition}
                    />
                  </Flex>

                  <HorizontalSlider
                    position={position}
                    maxPosition={maxPosition}
                    horizontalSliderRef={horizontalSliderRef}
                    updatePosition={updatePosition}
                  />
                </Box>

                <Box w="100%" px={6} pb={6}>
                  <Button
                    onClick={handleVerify}
                    w="100%"
                    size="lg"
                    colorScheme="teal"
                    isLoading={isVerifying}
                    loadingText="Verifying..."
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                    transition="all 0.2s"
                    fontWeight="bold"
                  >
                    ✓ Verify & Continue
                  </Button>
                </Box>
              </>
            ) : (
              <Flex direction="column" alignItems="center" py={20} gap={4}>
                <Spinner size="xl" color="teal.500" thickness="4px" speed="0.8s" />
                <Text color="gray.600" fontSize="sm">
                  Loading puzzle...
                </Text>
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
