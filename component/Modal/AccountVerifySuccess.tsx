import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxLogo } from 'public/assets';
import { FC } from 'react';
import { useAccountVerifySuccessModal } from 'store';

export const AccountVerifySuccess: FC = () => {
  const [visible, setVisible] = useAccountVerifySuccessModal(({ visible, setVisible }) => [visible, setVisible]);
  const router = useRouter();

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" my="4rem">
            <Image src={QuxLogo} width={100} height={100} alt="Qux Logo" />

            <Flex flexDirection="column" justifyContent="center" px="1rem" mt="4rem" gap="0.5rem">
              <Box color="white" fontSize="0.85rem" mb="5rem">
                <Text fontSize="1.25rem" fontWeight="bold" mb="2rem">
                  Your Account Is Verified!
                </Text>
                <Text>You can now use your account</Text>
                <Text>Account Nickname</Text>
                <Text>in QUXPay™</Text>
              </Box>

              <Button
                variant="primary"
                onClick={(): void => {
                  setVisible(!visible);
                  void router.push('/purchase');
                }}
              >
                Purchase Tokens
              </Button>
              <Button
                variant="secondary"
                onClick={(): void => {
                  setVisible(!visible);
                  void router.push('/dashboard');
                }}
              >
                Back To Home
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
