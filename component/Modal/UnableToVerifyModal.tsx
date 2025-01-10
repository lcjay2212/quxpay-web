import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { QuxLogo } from 'public/assets';
import { FC } from 'react';
import { useUnableToVerifyModal } from 'store';

export const UnableToVerifyModal: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = useUnableToVerifyModal((e) => [e.visible, e.setVisible]);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            my="4rem"
            mx={{ base: '0', md: 'auto' }}
            w={{ base: 'auto', md: 400 }}
          >
            <Image src={QuxLogo} width={100} height={100} alt="Qux Logo" />

            <Flex height="60vh" flexDirection="column" justifyContent="space-between" px="1rem" mt="4rem" gap="0.5rem">
              <Box color="white" fontSize="0.85rem" mb="5rem">
                <Text fontSize="1.25rem" fontWeight="bold" mb="2rem">
                  Unable to Verify Account
                </Text>
                <Text>
                  You will need to add a new account to try verification again. We're sorry for this inconvenience, but
                  we want to make sure your account is secure.
                </Text>
              </Box>

              <Flex flexDirection="column" gap="1rem">
                <Button
                  variant="primary"
                  onClick={(): void => {
                    setVisible(false);
                    router.push('/add-bank');
                  }}
                >
                  Add Account
                </Button>
                <Button
                  variant="secondary"
                  onClick={(): void => {
                    setVisible(false);
                    router.push('/dashboard');
                  }}
                >
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
