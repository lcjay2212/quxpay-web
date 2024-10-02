import { Button, chakra, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormContainer } from 'component';
import { STAGING_URL } from 'constants/url';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import PinInput from 'react-pin-input';
import { useAmountVerificationModal } from 'store';
import { notify } from 'utils';

export const AmountVerificationModal: FC = () => {
  const [visible, setVisible] = useAmountVerificationModal(({ visible, setVisible }) => [visible, setVisible]);
  const methods = useForm();
  const { handleSubmit, control } = methods;

  const { mutate, isPending } = useMutation({
    mutationKey: ['verifyBank'],
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/verify/bank`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      notify(data?.status?.message);
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
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <FormProvider {...methods}>
            <Flex flexDirection="column" my="5rem" justifyContent="center" alignItems="center">
              <Text color="primary" fontWeight="bold" fontSize="1.5rem" mb="2rem">
                A<chakra.span color="white">ccount verification</chakra.span>
              </Text>

              <Text color="white" mb="2rem">
                We are sending two small amount to <br /> your account. This should appear in the <br /> next 1-3 days.
                Please verify the amounts
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
                          color: 'white',
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
                          color: 'white',
                        }}
                        autoSelect
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                      />
                    </FormContainer>
                  )}
                />
                <Button variant="primary" type="submit" isLoading={isPending} mt="6rem" w="345px">
                  Submit
                </Button>
              </form>
            </Flex>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
