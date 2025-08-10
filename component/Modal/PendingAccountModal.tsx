import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { HeaderContainer } from 'component';
import { useLogout } from 'hooks';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { usePendingAccountModal } from 'store';

export const PendingAccountModal: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = usePendingAccountModal(({ visible, setVisible }) => [visible, setVisible]);
  const { logout } = useLogout();
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <HeaderContainer route="/login" label="Wallet">
            <Flex
              h="70vh"
              flexDirection="column"
              px="1rem"
              mt="4rem"
              gap="0.5rem"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="white" fontSize="0.85rem" mb="4rem">
                <Text fontSize="1.25rem" fontWeight="bold">
                  Your Account Is Pending
                </Text>
                <Text my="2rem">
                  Thanks for signing up for QUX Pay®!
                  <br />
                  We're validation your account right now.
                  <br /> Please check back in 24-48 hours and
                  <br /> you'll have access to the power of QUX®!
                </Text>
                <Text mb="2rem">
                  We'll send you an email once <br /> your account is available!
                </Text>
              </Box>
              <Button
                variant="primary"
                width={300}
                onClick={(): void => {
                  void logout({ message: 'Logout successful' });
                  router.push('/');
                  setVisible(!visible);
                }}
              >
                I Understand
              </Button>
            </Flex>
          </HeaderContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
