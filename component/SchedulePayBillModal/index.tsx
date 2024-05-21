/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSchedulePayBillModal } from 'store/useSchedulePayBillModal';
import { notify } from 'utils/notify';
import ScheduleBiller from './ScheduleBiller';

const SchedulePayBillModal: FC = () => {
  const [visible, setVisible] = useSchedulePayBillModal((state) => [state.visible, state.setVisible]);
  const { billerData } = useSchedulePayBillModal((state) => ({
    billerData: state.billerData,
  }));

  const method = useForm();

  const { handleSubmit, reset, setValue } = method;

  const router = useRouter();

  useEffect(() => {
    setValue('account_name', billerData?.account_name);
    setValue('account_number', billerData?.account_number);
    setValue('biller_id', billerData?.id);
  }, [setValue, billerData]);

  const { mutate, isLoading: loading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/billing/scheduled-payment`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        notify(`Scheduled set successfully`);
        void router.push('/dashboard');
        reset();
      },
      onError: ({ response }) => {
        notify(`${response?.data?.data?.errors?.scheduled_type}`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => {
    mutate({
      account_name: val?.account_name || billerData?.account_name,
      account_number: val?.account_number || billerData?.account_number,
      biller_id: billerData?.id,
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
                    <ScheduleBiller />
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

export default SchedulePayBillModal;
