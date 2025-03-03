import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTransactionHistoryModal } from 'store';

export const TransactionHistoryModal: FC = () => {
  const [visible, setVisible] = useTransactionHistoryModal((e) => [e.visible, e.setVisible]);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent bg="blue.100" mx="1rem">
        <ModalBody>
          <Flex flexDir="column" color="white" fontSize="0.85rem" justifyContent="space-between">
            <Text fontSize="1.25rem" fontWeight="bold" textAlign="center" my="1rem">
              Your order history is being updated.
            </Text>

            <Button mt="2rem" variant="primary" onClick={(): void => setVisible(!visible)}>
              Confirm
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
