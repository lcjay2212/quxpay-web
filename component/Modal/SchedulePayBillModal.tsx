/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ScheduleBiller } from 'component';
import { STAGING_URL } from 'constants/url';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSchedulePayBillModal } from 'store';
import { notify } from 'utils';

export const SchedulePayBillModal: FC = () => {
  const [visible, setVisible] = useSchedulePayBillModal((state) => [state.visible, state.setVisible]);
  const { billerData } = useSchedulePayBillModal((state) => ({
    billerData: state.billerData,
  }));

  const method = useForm();

  const { handleSubmit, reset, setValue } = method;

  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filter, setFilter] = useState('repeat');

  useEffect(() => {
    setValue('account_name', billerData?.account_name);
    setValue('account_number', billerData?.account_number);
    setValue('biller_id', billerData?.biller_id);
    setValue('biller_type_id', billerData?.biller_type_id);
    setValue('id', billerData?.id);
    setValue('frequency', billerData?.frequency);
    setValue('amount', billerData?.amount);
  }, [setValue, billerData]);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/billing/scheduled-payment`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify(`Scheduled set successfully`);
      void router.push('/dashboard');
      reset();
    },
    onError: ({ response }: any) => {
      notify(`${response?.data?.data?.errors?.scheduled_type}`, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    mutate({
      account_name: val?.account_name || billerData?.account_name,
      account_number: val?.account_number || billerData?.account_number,
      biller_id: billerData?.biller_id,
      biller_type_id: billerData?.biller_type_id,
      start_date: dayjs(startDate).format('YYYY-MM-DD'),
      end_date: dayjs(endDate).format('YYYY-MM-DD'),
      scheduled_type: filter,
      amount: val?.amount || billerData?.amount,
      frequency: val?.frequency || billerData?.frequency,
    } as any);
  };

  return (
    <Modal
      isOpen={visible}
      onClose={(): void => {
        setVisible(visible);
        reset();
      }}
      size={{ base: 'full', md: '3xl' }}
      isCentered
    >
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
                          setVisible(false);
                          reset();
                        }}
                      />
                      <Text color="primary" fontSize="3xl" fontWeight="bold">
                        S<span style={{ color: 'white' }}>chedule Biller</span>
                      </Text>
                    </Flex>
                  </Flex>
                  <Box textAlign="center">
                    <ScheduleBiller
                      startDate={startDate}
                      setStartDate={setStartDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      filter={filter}
                      setFilter={setFilter}
                    />
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
  );
};
