import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { QuxLogo } from 'public/assets';
import { FC } from 'react';
import { useAmountVerificationModal, usePendingBankAccountVerificationModal, useUser } from 'store';

export const PendingBankAccountVerificationModal: FC = () => {
  const [visible, setVisible] = usePendingBankAccountVerificationModal(({ visible, setVisible }) => [
    visible,
    setVisible,
  ]);
  const setAmountVerificationModalVisible = useAmountVerificationModal((e) => e.setVisible);
  const user = useUser((e) => e.user);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" my="3rem">
            <Image src={QuxLogo} width={150} height={150} alt="Qux Logo" />

            <Flex flexDirection="column" justifyContent="center" px="1rem" mt="4rem" gap="0.5rem">
              {!user?.corporate ? (
                <Box color="white" fontSize="0.85rem" mb="5rem">
                  <Text fontSize="1.25rem" fontWeight="bold">
                    Your Account Is Pending
                  </Text>
                  <Text my="2rem">Thanks for signing up for QUX Pay®!</Text>
                  <Text>Because you've submitted your first</Text>
                  <Text>account, you'll see two small amounts</Text>
                  <Text>depostited from</Text>
                  <Text>QUX TECHNOLOGIES INC</Text>
                  <Text>in your account. You will need these two</Text>
                  <Text>amounts to verify your bank account.</Text>
                  <Text mt="2rem">You will be able to use your bank account</Text>
                  <Text>as soon as verification is complete!</Text>
                </Box>
              ) : (
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
                  <Text>
                    Also, because you've submitted your first
                    <br /> account, once you're approved, you'll see
                    <br /> two small amounts deposited from
                    <br />
                    QUX TECHNOLOGIES INC
                    <br />
                    in your account. You will need these two
                    <br />
                    amounts to verify your bank account
                    <br />
                    once approved.
                  </Text>
                </Box>
              )}

              <Button variant="primary" onClick={(): void => setVisible(!visible)}>
                I Understand
              </Button>
              <Button
                variant="secondary"
                onClick={(): void => {
                  setVisible(!visible);
                  setAmountVerificationModalVisible(true);
                }}
              >
                Verify Now
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
