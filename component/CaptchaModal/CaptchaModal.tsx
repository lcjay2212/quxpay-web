/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCaptchaModal, useVerifyOtp } from 'store';
import { notify } from 'utils';

const CONTAINER_SIZE = 300;
const PIECE_SIZE = 120;
const ARROW_STEP = 5;
const ARROW_STEP_FAST = 10;

type Position = { x: number; y: number };

export const CaptchaModal: FC<{ label: 'login' | 'register' }> = ({ label }) => {
  const [visible, setVisible] = useCaptchaModal(({ visible, setVisible }) => [visible, setVisible]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggableRef = useRef<HTMLDivElement | null>(null);
  const horizontalSliderRef = useRef<HTMLDivElement | null>(null);
  const verticalSliderRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  const setVerify = useVerifyOtp((e) => e.setVerify);
  const maxPosition = useMemo(() => CONTAINER_SIZE - PIECE_SIZE, []);

  const clamp = useCallback((value: number, min: number, max: number) => Math.max(min, Math.min(max, value)), []);

  const updatePosition = useCallback(
    (nextX: number, nextY: number) => {
      const clampedPosition = {
        x: clamp(nextX, 0, maxPosition),
        y: clamp(nextY, 0, maxPosition),
      };
      setPosition(clampedPosition);
    },
    [clamp, maxPosition]
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const localX = clientX - rect.left - dragOffsetRef.current.x;
      const localY = clientY - rect.top - dragOffsetRef.current.y;
      updatePosition(localX, localY);
    },
    [updatePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      handlePointerMove(e.clientX, e.clientY);
    },
    [handlePointerMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    },
    [handlePointerMove]
  );

  const removeDragListeners = useCallback(
    (mouseMoveHandler: (e: MouseEvent) => void, touchMoveHandler: (e: TouchEvent) => void, stopHandler: () => void) => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', stopHandler as unknown as EventListener);
      document.removeEventListener('touchmove', touchMoveHandler, { passive: false } as AddEventListenerOptions);
      document.removeEventListener('touchend', stopHandler as unknown as EventListener);
    },
    []
  );

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
    removeDragListeners(handleMouseMove, handleTouchMove, stopDragging);
  }, [removeDragListeners, handleMouseMove, handleTouchMove]);

  const startDragging = useCallback(
    (clientX: number, clientY: number) => {
      const piece = draggableRef.current;
      const container = containerRef.current;
      if (!piece || !container) return;

      const containerRect = container.getBoundingClientRect();
      const pieceRect = piece.getBoundingClientRect();

      dragOffsetRef.current = {
        x: clientX - pieceRect.left - (containerRect.left - pieceRect.left),
        y: clientY - pieceRect.top - (containerRect.top - pieceRect.top),
      };

      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDragging as unknown as EventListener);
      document.addEventListener('touchmove', handleTouchMove, { passive: false } as AddEventListenerOptions);
      document.addEventListener('touchend', stopDragging as unknown as EventListener);
    },
    [handleMouseMove, handleTouchMove, stopDragging]
  );

  // Cleanup drag listeners on unmount
  useEffect(
    () => () => {
      isDraggingRef.current = false;
      removeDragListeners(handleMouseMove, handleTouchMove, stopDragging);
    },
    [removeDragListeners, handleMouseMove, handleTouchMove, stopDragging]
  );

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['captcha'],
    queryFn: async () => {
      try {
        const { data: responseData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/captcha`, {
          headers: {
            Version: 2,
          },
        });
        return responseData.data; // Return the expected data directly
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 500) {
            setVisible(false); // Hide some UI element
          }
          notify(error.response.data?.message || error.message, { status: 'error' }); // General error notification with more detail
        } else {
          // Handle network or unexpected errors
          notify('An unexpected error occurred.', { status: 'error' });
        }
        return null; // Return null in case of error to maintain consistent return type
      }
    },
  });

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleVerifySuccess = useCallback(
    ({ data }: any) => {
      notify(data?.status?.message);
      setVisible(false);
      if (label === 'login') {
        setVerify(true);
      }
    },
    [label, setVerify, setVisible]
  );

  const handleVerifyError = useCallback(
    ({ response }: any) => {
      const { status } = response.data;
      notify(`${status.message}`, { status: 'error' });
      setVisible(false);
      resetPosition();
      void refetch();
    },
    [refetch, resetPosition, setVisible]
  );

  const { mutate, isPending: isVerifying } = useMutation({
    mutationKey: ['captchaVerify'],
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/captcha/verify`, variable, {
        headers: { Version: 2 },
      }),
    onSuccess: handleVerifySuccess,
    onError: handleVerifyError,
  });

  // Auto-focus the container when modal opens and data is loaded
  useEffect(() => {
    if (visible && !isLoading && !isRefetching && containerRef.current) {
      containerRef.current.focus();
    }
  }, [visible, isLoading, isRefetching]);

  const focusSlider = useCallback((ref: React.RefObject<HTMLDivElement>) => {
    const sliderInput = ref.current?.querySelector('[role="slider"]') as HTMLElement | null;
    sliderInput?.focus();
  }, []);

  const handleArrowKey = useCallback(
    (key: string, shiftKey: boolean) => {
      const step = shiftKey ? ARROW_STEP_FAST : ARROW_STEP;
      const { x, y } = position;

      const keyActions: Record<string, () => void> = {
        ArrowUp: () => {
          updatePosition(x, y - step);
          focusSlider(verticalSliderRef);
        },
        ArrowDown: () => {
          updatePosition(x, y + step);
          focusSlider(verticalSliderRef);
        },
        ArrowLeft: () => {
          updatePosition(x - step, y);
          focusSlider(horizontalSliderRef);
        },
        ArrowRight: () => {
          updatePosition(x + step, y);
          focusSlider(horizontalSliderRef);
        },
      };

      keyActions[key]();
    },
    [position, updatePosition, focusSlider]
  );

  // Keyboard handler for arrow keys
  useEffect(() => {
    if (!visible || isLoading || isRefetching) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleArrowKey(e.key, e.shiftKey);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, isLoading, isRefetching, handleArrowKey]);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg="transparent" maxW="600px" mx={4}>
        <ModalBody p={0}>
          <Flex flexDir="column" alignItems="center" bg="white" borderRadius="2xl" boxShadow="2xl" overflow="hidden">
            {/* Header */}
            <Box w="100%" bg="teal.600" py={4} px={6}>
              <Text color="white" fontSize="xl" fontWeight="bold" textAlign="center">
                🔒 Security Verification
              </Text>
              <Text color="teal.100" fontSize="sm" textAlign="center" mt={1}>
                Complete the puzzle to continue
              </Text>
            </Box>

            {!isLoading && !isRefetching ? (
              <>
                {/* Instructions */}
                <Box w="100%" px={6} py={4} bg="teal.50" borderBottom="1px" borderColor="teal.100">
                  <Text fontSize="sm" color="gray.700" fontWeight="medium" mb={2}>
                    📋 How to solve:
                  </Text>
                  <Flex direction="column" gap={1}>
                    <Text fontSize="xs" color="gray.600">
                      • <strong>Drag</strong> the puzzle piece to fit the missing area
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      • Use <strong>arrow keys</strong> (↑ ↓ ← →) for precise control
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      • Or use the <strong>sliders</strong> below the puzzle
                    </Text>
                  </Flex>
                </Box>

                {/* Puzzle Area */}
                <Box w="100%" px={6} py={6}>
                  <Flex gap={3} justifyContent="center" alignItems="center">
                    {/* Main Puzzle Container */}
                    <Box
                      ref={containerRef}
                      position="relative"
                      width={300}
                      height={300}
                      opacity={isVerifying ? 0.6 : 1}
                      role="application"
                      aria-label="Captcha puzzle area"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="lg"
                      border="3px solid"
                      borderColor={isVerifying ? 'teal.400' : 'gray.300'}
                      transition="all 0.3s"
                      _hover={{ borderColor: 'teal.400' }}
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
                      <Image src={data?.image} width={300} height={300} alt="Captcha Image" />
                      <Box
                        ref={draggableRef}
                        style={{ left: `${position.x}px`, top: `${position.y}px` }}
                        position="absolute"
                        cursor={isDraggingRef.current ? 'grabbing' : 'grab'}
                        transition="filter 0.2s"
                        _hover={{ filter: 'brightness(1.1)' }}
                        _active={{ filter: 'brightness(0.95)' }}
                        onMouseDown={(e): void => {
                          e.preventDefault();
                          startDragging(e.clientX, e.clientY);
                        }}
                        onTouchStart={(e): void => {
                          const t = e.touches[0];
                          startDragging(t.clientX, t.clientY);
                        }}
                        aria-label="Draggable puzzle piece"
                        // boxShadow="0 4px 8px rgba(0,0,0,0.3)"
                      >
                        <Image src={data?.jigsaw_part_missing} width={120} height={120} alt="Jigsaw Part Image" />
                      </Box>
                    </Box>

                    {/* Vertical Slider */}
                    <Box ref={verticalSliderRef} h={300}>
                      <Slider
                        min={0}
                        max={maxPosition}
                        isReversed
                        value={position.y}
                        orientation="vertical"
                        onChange={(value): void => updatePosition(position.x, value)}
                        aria-label="Vertical position"
                      >
                        <SliderTrack bg="gray.200" w="8px" borderRadius="full">
                          <SliderFilledTrack bg="teal.500" />
                        </SliderTrack>
                        <SliderThumb boxSize={8} bg="teal.500" border="3px solid white" boxShadow="md" />
                      </Slider>
                    </Box>
                  </Flex>

                  {/* Horizontal Slider */}
                  <Box width={300} ref={horizontalSliderRef} mt={4} mx="auto">
                    <Slider
                      value={position.x}
                      onChange={(value): void => updatePosition(value, position.y)}
                      min={0}
                      max={maxPosition}
                      aria-label="Horizontal position"
                    >
                      <SliderTrack bg="gray.200" h="8px" borderRadius="full">
                        <SliderFilledTrack bg="teal.500" />
                      </SliderTrack>
                      <SliderThumb boxSize={8} bg="teal.500" border="3px solid white" boxShadow="md" />
                    </Slider>
                  </Box>
                </Box>

                {/* Footer with Button */}
                <Box w="100%" px={6} pb={6}>
                  <Button
                    onClick={(): void => {
                      mutate({
                        captcha_id: data?.captcha_id,
                        x: position.x,
                        y: position.y,
                      } as any);
                    }}
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
