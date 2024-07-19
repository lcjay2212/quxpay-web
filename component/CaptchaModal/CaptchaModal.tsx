import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { FETCH_CAPTCHA } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useCaptchaModal } from 'store';
import { notify, queryClient } from 'utils';

export const CaptchaModal: FC = () => {
  const [visible, setVisible] = useCaptchaModal(({ visible, setVisible }) => [visible, setVisible]);

  const { data, isLoading } = useQuery('captcha', FETCH_CAPTCHA, {
    refetchOnWindowFocus: false,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const { mutate, isLoading: isVerifying } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/captcha/verify`, variable, {
        headers: {
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        notify(data?.status?.message);
        setVisible(false);
      },
      onError: ({ response }) => {
        const { data, status } = response.data;
        notify(`${status.message}`, { status: 'error' });
        queryClient.setQueryData('captcha', data);
      },
    }
  );

  const handleMouseDown = (e): void => {
    if (e.button !== 0) return;
    setRel({ x: e.pageX - position.x, y: e.pageY - position.y });
    setDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = (): void => {
    setDragging(false);
    mutate({
      captcha_id: data?.captcha_id,
      x: position.x,
      y: position.y,
    } as any);
  };

  const handleMouseMove = (e): void => {
    if (dragging) setPosition({ x: e.pageX - rel.x, y: e.pageY - rel.y });
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
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
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
