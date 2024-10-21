import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AccountVerifySuccess, FormContainer } from 'component';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import PinInput from 'react-pin-input';
import { useAccountVerifySuccessModal, useAmountVerificationModal } from 'store';
import { notify, queryClient } from 'utils';

export const AmountVerificationModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visible, setVisible] = useAmountVerificationModal(({ visible, setVisible }) => [visible, setVisible]);
  const setAccountVerifySuccessModalVisible = useAccountVerifySuccessModal((e) => e.setVisible);
  const methods = useForm();
  const { handleSubmit, control } = methods;
  const data = queryClient.getQueryData<{
    status: string;
    show_having_trouble: boolean;
  }>(['bankStatus']);

  const { mutate, isPending } = useMutation({
    mutationKey: ['verifyBank'],
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/verify/bank`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      notify(data?.status?.message);
      setAccountVerifySuccessModalVisible(true);
      setVisible(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      const { status } = response.data;
      notify(`${status.message}`, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    mutate(val);
  };

  return (
    <>
      <AccountVerifySuccess />

      <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalBody>
            <Box maxW={400} justifyContent="center" m="auto">
              <FormProvider {...methods}>
                <ArrowBackIcon
                  color="white"
                  mr="1rem"
                  cursor="pointer"
                  mt="1rem"
                  onClick={(): void => setVisible(!visible)}
                />
                <Flex flexDirection="column" my="5rem" justifyContent="center" alignItems="center">
                  <Text color="primary" fontWeight="bold" fontSize="1.5rem" mb="2rem">
                    A<chakra.span color="white">ccount verification</chakra.span>
                  </Text>

                  <Text color="white" mb="2rem">
                    We are sending two small amount to <br /> your account. This should appear in the <br /> next 1-3
                    days. Please verify the amounts
                    <br /> that were sent by typing those amounts here.
                  </Text>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      control={control}
                      name="amount1"
                      rules={{
                        required: 'First Amount is required',
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }): ReactElement => (
                        <FormContainer label="First amount:" errorMessage={error?.message ?? ''}>
                          <PinInput
                            length={2}
                            initialValue={value}
                            onChange={(val): void => {
                              onChange(val);
                            }}
                            type="numeric"
                            inputMode="number"
                            style={{ padding: '10px' }}
                            inputStyle={{
                              borderColor: '#7f7f7f',
                              borderRadius: '1rem',
                              color: 'black2',
                              background: 'white',
                            }}
                            autoSelect
                            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                          />
                        </FormContainer>
                      )}
                    />

                    <Controller
                      control={control}
                      name="amount2"
                      rules={{
                        required: 'Second Amount is required',
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }): ReactElement => (
                        <FormContainer label="Second amount:" errorMessage={error?.message ?? ''}>
                          <PinInput
                            length={2}
                            initialValue={value}
                            onChange={(val): void => {
                              onChange(val);
                            }}
                            type="numeric"
                            inputMode="number"
                            style={{ padding: '10px' }}
                            inputStyle={{
                              borderColor: '#7f7f7f',
                              borderRadius: '1rem',
                              color: 'black2',
                              background: 'white',
                            }}
                            autoSelect
                            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                          />
                        </FormContainer>
                      )}
                    />

                    {data?.show_having_trouble && (
                      <>
                        <Text color="white" mt="4rem">
                          Having Trouble?
                        </Text>
                        <Text color="primary" cursor="pointer" as="u" onClick={(): void => onOpen()}>
                          Click here to start verification again.
                        </Text>
                      </>
                    )}

                    <Button variant="primary" type="submit" isLoading={isPending} mt="3rem" w="345px">
                      Submit
                    </Button>
                  </form>
                </Flex>
              </FormProvider>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent bg="black">
                <ModalBody>
                  <Flex
                    flexDir="column"
                    placeContent="center"
                    alignItems="center"
                    textAlign="center"
                    bg="gray"
                    borderRadius="xl"
                    p="2rem"
                  >
                    <Text color="white" fontSize="12px" fontWeight="bold" mb="2rem">
                      Are you sure you want to start over?
                    </Text>

                    <Flex flexDirection="column" gap={2}>
                      <Button variant="primary" borderRadius="1rem" onClick={(): void => onClose()}>
                        Yes, start adding the account over
                      </Button>
                      <Button variant="primary" borderRadius="1rem" onClick={(): void => onClose()}>
                        No, I'll try verifying
                      </Button>
                    </Flex>
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
