import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormContainer } from 'component';
import Image from 'next/image';
import { QuxTokenIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useBalance, usePayBillsModal, useSuccessPayBillsModal } from 'store';
import { notify } from 'utils';
import { SuccessPayBillModal } from './SuccessPayBillModal';

export const PayBillsModal: FC = () => {
  const [visible, setVisible] = usePayBillsModal((state) => [state.visible, state.setVisible]);
  const { setTrigger } = useSuccessPayBillsModal((e) => ({
    setTrigger: e.setVisible,
  }));
  const { headerName, billerData } = usePayBillsModal((state) => ({
    headerName: state.headerName,
    billerData: state.billerData,
  }));
  const [tempData, setTempDate] = useState();
  const [step, setStep] = useState(1);
  const method = useForm();
  const { handleSubmit, control, reset } = method;
  const { balance, isLoading } = useBalance();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/billing/payment?biller_id=${billerData.id}`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      setTempDate(data?.data);
      setVisible(false);
      setTrigger(true);
      setStep(1);
      reset();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      notify(`${response?.data?.data?.errors?.balance}`, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      mutate({
        payment_method: 'token',
        biller_category_id: billerData.biller_category_id,
        amount: val.amount,
        account_number: val.account_number,
        account_name: val.account_name,
      } as any);
    }
  };

  return (
    <>
      <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalBody>
            <FormProvider {...method}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex flexDir="column" justifyContent="space-between" h="98vh">
                  <Box>
                    <Flex justifyContent="space-between" alignItems="center" color="white">
                      <Flex mt="1rem" alignItems="center">
                        <ArrowBackIcon
                          mr="1rem"
                          cursor="pointer"
                          onClick={(): void => {
                            if (step === 2) {
                              setStep(1);
                            } else {
                              setVisible(false);
                            }
                          }}
                        />
                        <Text fontWeight="semibold">Pay bills to {headerName}</Text>
                      </Flex>
                    </Flex>
                    <Box textAlign="center">
                      {step === 1 && (
                        <Box textAlign="start" color="white" my="3rem">
                          <Text fontSize="1.2rem" fontWeight="semibold">
                            Available Balance
                          </Text>
                          <Flex alignItems="center">
                            <span>
                              <Image src={QuxTokenIcon} width={20} height={20} alt="Qux Token" />
                            </span>
                            {!isLoading ? (
                              <Text fontSize="1.2rem" fontWeight="semibold">
                                {balance.toFixed(2)}
                              </Text>
                            ) : (
                              <Spinner />
                            )}
                          </Flex>

                          <Box my="5rem">
                            <Controller
                              control={control}
                              name="amount"
                              rules={{ required: 'Amount is required' }}
                              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                                <FormContainer errorMessage={error?.message ?? ''}>
                                  <Input
                                    variant="flushed"
                                    placeholder="0.00"
                                    textAlign="center"
                                    fontSize="2rem"
                                    fontWeight="semibold"
                                    onChange={(e): void => onChange(+e.target.value)}
                                    value={value}
                                    onBlur={onBlur}
                                    type="number"
                                  />
                                </FormContainer>
                              )}
                            />
                          </Box>
                        </Box>
                      )}
                      {step === 2 && (
                        <Box my="5rem" color="white">
                          <Controller
                            control={control}
                            name="account_number"
                            rules={{ required: 'Account number is required' }}
                            render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                              <FormContainer errorMessage={error?.message ?? ''}>
                                <Input
                                  variant="flushed"
                                  placeholder="Customer Account Number"
                                  textAlign="center"
                                  fontSize="1rem"
                                  fontWeight="semibold"
                                  onChange={(e): void => onChange(+e.target.value)}
                                  value={value}
                                  onBlur={onBlur}
                                  type="number"
                                />
                              </FormContainer>
                            )}
                          />

                          <Controller
                            control={control}
                            name="account_name"
                            rules={{ required: 'Account name is required' }}
                            render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                              <FormContainer errorMessage={error?.message ?? ''}>
                                <Input
                                  variant="flushed"
                                  placeholder="Account Nickname e.g. Work Mobile"
                                  textAlign="center"
                                  fontSize="1rem"
                                  fontWeight="semibold"
                                  onChange={onChange}
                                  value={value}
                                  onBlur={onBlur}
                                />
                              </FormContainer>
                            )}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box textAlign="center">
                    <Button type="submit" variant="primary" borderRadius="1rem" w={350} h="3.25rem" isLoading={loading}>
                      Next
                    </Button>
                  </Box>
                </Flex>
              </form>
            </FormProvider>
          </ModalBody>
        </ModalContent>
      </Modal>
      <SuccessPayBillModal data={tempData} />
    </>
  );
};
