import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useUser } from 'store';
import { useDeleteAccountModal } from 'store/useDeleteAccountModal';
import { clearStorage, notify } from 'utils';

export const DeleteAccountModal: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = useDeleteAccountModal((e) => [e.visible, e.setVisible]);
  const setUser = useUser((e) => e.setUser);

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/delete-my-account`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      clearStorage();
      notify('Account deleted successfully');
      setVisible(!visible);
      setUser(null);
      setTimeout(() => {
        void router.push('/');
      }, 3000);
    },
    onError: () => {
      notify(`Failed to delete account`, { status: 'error' });
    },
  });

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent bg="blue.100" mx="1rem">
        <ModalBody>
          <Flex flexDir="column" color="white" fontSize="0.85rem" justifyContent="space-between">
            <Text fontSize="1.25rem" fontWeight="bold" textAlign="center" my="1rem">
              Are you sure you want to delete your account?
            </Text>

            <Button mt="2rem" variant="primary" isLoading={isPending} onClick={(): void => mutate()}>
              Confirm
            </Button>
            <Button
              my="1rem"
              variant="secondary"
              isLoading={isPending}
              onClick={(): void => {
                setVisible(!visible);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
