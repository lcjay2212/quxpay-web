import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';
import { usePendingAccountModal } from 'store/usePendingAccountModal';

const PendingAccountModal: FC = () => {
  const [visible, setVisible] = usePendingAccountModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <HeaderContainer route="/login" label="Wallet">
            <Flex justifyContent="center" my={{ base: '2rem', md: '15rem' }}>
              <Box color="white" fontSize="0.85rem">
                <Text fontSize="1.25rem" fontWeight="bold">
                  Your Account Is Pending
                </Text>
                <Text my="1rem">Thanks for signing up for QUXPay™!</Text>
                <Text>We're validating your account right now.</Text>
                <Text my="0.5rem">Please check back in 24-48 hours and you'll</Text>
                <Text>have access to the power of Qux®!</Text>
              </Box>
            </Flex>
          </HeaderContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PendingAccountModal;
