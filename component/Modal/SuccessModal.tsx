import { Button, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useSuccessModal } from 'store';

export const SuccessModal: FC = () => {
  const { visible, setVisible, message } = useSuccessModal();
  const router = useRouter();
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent bg="#10101F" borderRadius="2rem" p="2rem" textAlign="center" color="white" overflow="hidden">
        <ModalBody>
          <Text color="white" mb="1rem" fontWeight="bold">
            {message}
          </Text>

          <Button
            variant="primary"
            onClick={(): void => {
              setVisible(false);
              void router.push('/dashboard');
            }}
          >
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
