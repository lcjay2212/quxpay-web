import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useAccountVerifySuccessModal } from 'store';
import { queryClient } from 'utils';

export const AccountVerifySuccess: FC = () => {
  const [visible, setVisible] = useAccountVerifySuccessModal(({ visible, setVisible }) => [visible, setVisible]);
  const router = useRouter();
  const data = queryClient.getQueryData<{
    account_nickname: string;
  }>(['bankStatus']);

  const handleClose = (route: string): void => {
    void queryClient.removeQueries({ queryKey: ['bankStatus'] });
    setVisible(!visible);
    void router.push(route);
  };

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" my="4rem">
            <Image src="/assets/images/qux-logo.webp" width={100} height={100} alt="Qux Logo" />

            <Flex height="60vh" flexDirection="column" justifyContent="space-between" px="1rem" mt="4rem" gap="0.5rem">
              <Box color="white" fontSize="0.85rem" mb="5rem">
                <Text fontSize="1.25rem" fontWeight="bold" mb="2rem">
                  Your Account Is Verified!
                </Text>
                <Text>You can now use your account</Text>
                <Text>{data?.account_nickname}</Text>
                <Text>in QUX Pay®</Text>
              </Box>

              <Flex flexDirection="column" gap="1rem">
                <Button variant="primary" onClick={(): void => handleClose('/purchase')}>
                  Purchase QUX eToken®
                </Button>
                <Button variant="secondary" onClick={(): void => handleClose('/dashboard')}>
                  Back To Home
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
