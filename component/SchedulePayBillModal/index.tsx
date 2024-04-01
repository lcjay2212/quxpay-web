import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { TextField } from 'component/TextField';
import { FETCH_BILLER_BY_CATEGORY_ID } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BillsIcon, SuccessCircleIcon } from 'public/assets';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSchedulePayBillModal } from 'store/useSchedulePayBillModal';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';
import ScheduleBillerStepThree from './ScheduleBillerStepThree';

type TempDataType = {
  account_number?: number;
  amount_paid?: number;
  biller_name?: string;
  date?: string;
  fee?: number;
  reference_number?: number;
  total_amount?: number;
};

const SchedulePayBillModal: FC = () => {
  const [visible, setVisible] = useSchedulePayBillModal((state) => [state.visible, state.setVisible]);
  const { headerName, billerData, setBillerData, setBillerId, billerId } = useSchedulePayBillModal((state) => ({
    headerName: state.headerName,
    billerData: state.billerData,
    setBillerData: state.setBillerData,
    billerId: state.billerId,
    setBillerId: state.setBillerId,
  }));
  const [step, setStep] = useState(1);
  const method = useForm();

  const queryClient = useQueryClient();
  const data: any = queryClient.getQueryData('billingCategories');
  const { data: billerList, isLoading: billerListLoading } = useQuery(
    ['posHistoryById', billerId],
    FETCH_BILLER_BY_CATEGORY_ID,
    errorHandler
  );

  const { handleSubmit } = method;
  const [trigger, setTrigger] = useState(false);
  const [tempData, setTempDate] = useState<TempDataType>();
  const router = useRouter();

  const { mutate, isLoading: loading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/billing/scheduled-payment?biller_id=${billerData.id}`, variable, {
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

  const onSubmit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      setStep((e) => e + 1);
    }

    if (step === 3) {
      mutate(val);
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
                            if (step === 3) {
                              setStep(2);
                            }
                            if (step === 2) {
                              setStep(1);
                            } else {
                              setVisible(false);
                            }
                          }}
                        />
                        {step === 1 && (
                          <Text color="primary" fontSize="3xl" fontWeight="bold">
                            B<span style={{ color: 'white' }}>iller Categories</span>
                          </Text>
                        )}
                        {step === 2 && (
                          <Text color="primary" fontSize="3xl" fontWeight="bold">
                            B<span style={{ color: 'white' }}>iller Lists</span>
                          </Text>
                        )}
                        {step === 3 && (
                          <Text color="primary" fontSize="3xl" fontWeight="bold">
                            S<span style={{ color: 'white' }}>chedule Biller</span>
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                    <Box textAlign="center">
                      {step === 1 && (
                        <Box bg="blue.100" borderRadius="20px" p="1.5rem" my="2rem">
                          <Grid templateColumns="repeat(4, 1fr)" gap={{ base: 2, md: 6 }}>
                            {data?.map((item) => (
                              <Flex
                                flexDir="column"
                                key={item.id}
                                textAlign="center"
                                cursor="pointer"
                                _hover={{
                                  color: 'primary',
                                }}
                                id={item.id}
                                onClick={(): void => {
                                  setStep(2);
                                  setBillerId(item.id);
                                }}
                              >
                                <Flex justifyContent="center" width="auto" height={50}>
                                  <Image src={BillsIcon} width={45} height={50} alt={item.id} placeholder="empty" />
                                </Flex>
                                <Text color="white" mt="0.5rem" fontSize={{ base: '0.75rem', md: '1rem' }}>
                                  {item.name}
                                </Text>
                              </Flex>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {step === 2 && (
                        <Box mx="1rem" mt="1rem">
                          <TextField isSearch type="email" value={''} placeholder="Search" />
                          {billerListLoading ? (
                            <Box textAlign="center" my="3rem">
                              <Spinner color="primary" size="xl" />
                            </Box>
                          ) : (
                            <Box my="2rem">
                              {billerList?.map((item) => (
                                <Flex
                                  key={item.id}
                                  justifyContent="space-between"
                                  alignItems="center"
                                  onClick={(): void => {
                                    setBillerData(item);
                                    setStep(3);
                                  }}
                                >
                                  <Flex justifyContent="center" alignItems="center">
                                    <Flex justifyContent="center" width="auto" height={50}>
                                      <Image
                                        src={BillsIcon}
                                        width={100}
                                        height={100}
                                        alt={item.id}
                                        style={{
                                          objectFit: 'fill',
                                        }}
                                        placeholder="empty"
                                      />
                                    </Flex>
                                    <Text color="white" fontWeight="semibold" fontSize="14px">
                                      {item.name}
                                    </Text>
                                  </Flex>
                                  <ChevronRightIcon color="white" w={10} h={10} />
                                </Flex>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                      {step === 3 && <ScheduleBillerStepThree />}
                    </Box>
                  </Box>
                  <Box textAlign="center">
                    {step === 3 && (
                      <Button
                        type="submit"
                        variant="primary"
                        borderRadius="1rem"
                        w={350}
                        h="3.25rem"
                        isLoading={loading}
                      >
                        Next
                      </Button>
                    )}
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
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SchedulePayBillModal;
