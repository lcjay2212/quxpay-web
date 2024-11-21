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
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCaptchaModal } from 'store';
import { useLogin } from 'store/useLogin';
import { notify } from 'utils';

export const CaptchaModal: FC<{ label: 'login' | 'register' }> = ({ label }) => {
  const [visible, setVisible] = useCaptchaModal(({ visible, setVisible }) => [visible, setVisible]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { getValues } = useFormContext();
  const { login } = useLogin();
  const [sliderValue, setSliderValue] = useState(0);

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

  const { mutate, isPending: isVerifying } = useMutation({
    mutationKey: ['captchaVerify'],
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/captcha/verify`, variable, {
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
      const { status } = response.data;
      notify(`${status.message}`, { status: 'error' });
      setVisible(false);
      setPosition({ x: 0, y: 0 });
      void refetch();
    },
  });

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
            {!isLoading && !isRefetching ? (
              <>
                <Box position="relative" width={300} height={300} opacity={isVerifying ? 0.5 : 1}>
                  {isVerifying && (
                    <Box position="absolute" zIndex={9999} top="40%" right="40%">
                      <Spinner color="primary" size="xl" />
                    </Box>
                  )}
                  <Image src={data?.image} width={300} height={300} alt="Captcha Image" />
                  <Box style={{ left: `${position.x}px`, top: `${data.y}px` }} position="absolute" cursor="pointer">
                    <Image src={data?.jigsaw_part_missing} width={120} height={120} alt="Jigsaw Part Image" />
                  </Box>
                </Box>
                <Box width={300}>
                  <Slider
                    mt={4}
                    value={sliderValue}
                    onChange={(e): void => {
                      const newX = (e / 250) * 300; // Convert slider value to x position
                      setPosition({ x: newX, y: data?.y });
                      setSliderValue(e);
                    }}
                    min={0}
                    max={150}
                  >
                    <SliderTrack bg="gray.100">
                      <SliderFilledTrack bg="blue.500" />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                </Box>
                <Button
                  onClick={(): void => {
                    mutate({
                      captcha_id: data?.captcha_id,
                      x: position.x,
                      y: data.y,
                    } as any);
                  }}
                >
                  Submit
                </Button>
              </>
            ) : (
              <Spinner />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
