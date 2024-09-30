/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FETCH_CAPTCHA } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCaptchaModal } from 'store';
import { useLogin } from 'store/useLogin';
import { notify, queryClient } from 'utils';

export const CaptchaModal: FC<{ label: 'login' | 'register' }> = ({ label }) => {
  const [visible, setVisible] = useCaptchaModal(({ visible, setVisible }) => [visible, setVisible]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { getValues } = useFormContext();
  const { login } = useLogin();

  const { data, isLoading } = useQuery({
    queryKey: ['captcha'],
    queryFn: FETCH_CAPTCHA,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending: isVerifying } = useMutation({
    mutationKey: ['captchaVerify'],
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/captcha/verify`, variable, {
        headers: {
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      notify(data?.status?.message);
      setVisible(false);
      if (label === 'login') {
        login.mutate({
          email: getValues('email'),
          password: getValues('password'),
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      const { data, status } = response.data;
      notify(`${status.message}`, { status: 'error' });
      queryClient.setQueryData(['captcha'], data);
    },
  });
  const startDragging = (clientX: number, clientY: number): void => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const onDrag = (clientX: number, clientY: number): void => {
    if (!isDragging) return;

    const dx = clientX - startPos.x;
    const dy = clientY - startPos.y;

    setPosition((prevPos) => ({
      x: prevPos.x + dx,
      y: prevPos.y + dy,
    }));

    setStartPos({ x: clientX, y: clientY });
  };

  const stopDragging = (): void => {
    setIsDragging(false);
    mutate({
      captcha_id: data?.captcha_id,
      x: position.x,
      y: position.y,
    } as any);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => startDragging(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => onDrag(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    startDragging(touch.clientX, touch.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    onDrag(touch.clientX, touch.clientY);
  };

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">
        <ModalBody>
          <Flex
            flexDir="column"
            placeContent="center"
            alignItems="center"
            textAlign="center"
            bg="gray"
            borderRadius="xl"
            p="2rem"
          >
            <Text color="white" mb="1rem" fontWeight="bold">
              Captcha
            </Text>
            <Text color="white" mb="1rem" fontWeight="bold">
              Please move the puzzle pieces
            </Text>
            {!isLoading ? (
              <Box position="relative" width={300} height={300} opacity={isVerifying ? 0.5 : 1}>
                {isVerifying && (
                  <Box position="absolute" zIndex={9999} top="40%" right="40%">
                    <Spinner color="primary" size="xl" />
                  </Box>
                )}
                <Image src={data?.image} width={300} height={300} alt="Captcha Image" />
                <Box
                  style={{ left: `${position.x}px`, top: `${position.y}px` }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={stopDragging}
                  position="absolute"
                  cursor="pointer"
                >
                  <Image src={data?.jigsaw_part_missing} width={120} height={120} alt="Jigsaw Part Image" />
                </Box>
              </Box>
            ) : (
              <Spinner />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
