import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useQuxPayFeeModal } from 'store';

export const QuxTokenFeeModal: FC = () => {
  const [visible, setVisible] = useQuxPayFeeModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody color="white" pb={6} bg="gray" textAlign="center">
          <Flex flexDir="column">
            <Text fontSize="14px" my="1rem">
              QUX Token Fees allow for encryption
              <br />
              between users to remain secure.
              <br />
              <br />
              You deserve privacy and transparency.
              <br />
              Our fee is only 3%.
              <br />
              Using a top tier credit card could cost your
              <br />
              merchant 6% or more, potentially raising
              <br />
              your prices, giving away your data, and
              <br />
              can cause your local merchants to give
              <br />
              money to outside corporations.
              <br />
              Point cards are poison.
              <br />
              Support Local.
              <br />
              Keep your data private.
              <br />
              Tell your friends to use QUXPay™!
            </Text>
            <Button variant="primary" mt="1rem" onClick={(): void => setVisible(!visible)}>
              I Will Tell My Friends
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
