import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxTokenIcon, SuccessCircleIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useBalance } from 'store/useBalance';
import { usePayBillsModal } from 'store/usePayBillsModal';
import { notify } from 'utils/notify';

type TempDataType = {
  account_number?: number;
  account_name?: string;
  amount_paid?: number;
  biller_name?: string;
  date?: string;
  fee?: number;
  reference_number?: number;
  total_amount?: number;
  biller_category_id: number;
  biller_id: number;
};

const PayBillsModal: FC = () => {
  const [visible, setVisible] = usePayBillsModal((state) => [state.visible, state.setVisible]);
  const { headerName, billerData } = usePayBillsModal((state) => ({
    headerName: state.headerName,
    billerData: state.billerData,
  }));
  const [step, setStep] = useState(1);
  const method = useForm();
  const { handleSubmit, control } = method;
  const { balance, isLoading } = useBalance();
  const [trigger, setTrigger] = useState(false);
  const [tempData, setTempDate] = useState<TempDataType>();
  const router = useRouter();

  const { mutate, isLoading: loading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/billing/payment?biller_id=${billerData.id}`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: ({ data }) => {
        setTempDate(data?.data);
        setTrigger(true);
      },
      onError: () => {
        notify(`Error`, { status: 'error' });
      },
    }
  );

  const { mutate: savePayment, isLoading: savePaymentLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/billing/save-info`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: ({ data }) => {
        setTempDate(data?.data);
        notify('Saved payment info successfully');
        void router.push('/pay-bills');
      },
      onError: () => {
        notify(`Error`, { status: 'error' });
      },
    }
  );

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
        account_name: 'John Doe',
      } as any);
    }
  };

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          {!trigger ? (
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
          ) : (
            <Box>
              <ArrowBackIcon
                mt="1rem"
                color="white"
                mr="1rem"
                cursor="pointer"
                onClick={(): void => void router.push('/pay-bills')}
              />
              <Flex display="column" textAlign="center" my="6rem" color="white">
                <Flex justifyContent="center">
                  <Image src={SuccessCircleIcon} width={80} height={80} alt="success" />
                </Flex>
                <Text fontSize="1.5rem" fontWeight="bold" color="primary" mt="1rem">
                  Payment Received
                </Text>
                <Text fontWeight="bold">{headerName}</Text>
                <Text fontWeight="bold" fontSize="2rem">
                  {tempData?.total_amount?.toFixed(2)}
                </Text>
                <Divider mt="1rem" mb="2rem" />
                <Flex justifyContent="space-between">
                  <Text>Account Number</Text>
                  <Text>{tempData?.reference_number}</Text>
                </Flex>
                <Flex justifyContent="space-between" mt="1rem">
                  <Text>Account Name</Text>
                  <Text>{tempData?.biller_name}</Text>
                </Flex>
                <Flex justifyContent="space-between" my="1rem">
                  <Text>Amount Paid</Text>
                  <Text>{tempData?.amount_paid?.toFixed(2)}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="1rem">
                  <Text>Fee</Text>
                  <Text>{tempData?.fee?.toFixed(2)}</Text>
                </Flex>
                <Divider mt="1rem" mb="2rem" />
                <Text fontSize="12px">Ref. No. 12345 6780 9</Text>
                <Text fontSize="12px" mt="1rem" mb="2rem">
                  {tempData?.date}
                </Text>
                <Text fontSize="12px">
                  This has been processed and your payment will be <br />
                  <br /> posted next business day
                </Text>
              </Flex>

              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  w={350}
                  h="3.25rem"
                  isLoading={savePaymentLoading}
                  onClick={(): void =>
                    savePayment({
                      account_number: tempData?.account_number,
                      account_name: tempData?.account_name,
                      biller_category_id: tempData?.biller_category_id,
                      biller_id: tempData?.biller_id,
                      tag: 'Service',
                    } as any)
                  }
                >
                  Save to biller list
                </Button>
              </Box>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PayBillsModal;
