/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AddCreditCardForm } from 'component/AddCreditCardForm';

import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouteParams } from 'store';
import { useCreditCartModal } from 'store/useCreditCartModal';
import { notify, queryClient } from 'utils';

export const CreditCardModal: FC = () => {
  const { visible, setVisible } = useCreditCartModal((e) => e);
  const method = useForm();
  const { handleSubmit } = method;
  const params = useRouteParams((e) => e.params);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wallet/add-credit-card`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      setVisible(false);
      notify('Credit Card Added Successfully', { status: 'success' });
      void queryClient.invalidateQueries({ queryKey: ['wpPoDetails', params?.t] });
    },
    onError: ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || response?.data?.status?.message, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    void mutateAsync({ ...val, default: true } as any);
  };

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(false)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent bg="blue.100" py="1rem" borderRadius="2rem">
        <ModalBody maxH={600} m="auto" overflowY="auto">
          <Text fontSize="24px" mb="1rem" color="white" fontWeight="bold">
            Add Credit Card
          </Text>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddCreditCardForm />

              <Flex gap="1rem" flexDir="column" mt="2rem">
                <Button type="submit" variant="primary" borderRadius="1rem" w="full" h="3.25rem" isLoading={isPending}>
                  Add Credit Card
                </Button>

                <Button
                  type="button"
                  variant="delete"
                  borderRadius="1rem"
                  w="full"
                  h="3.25rem"
                  onClick={(): void => setVisible(false)}
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
