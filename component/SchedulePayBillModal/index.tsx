import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
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

  const [step, setStep] = useState(1);
  const method = useForm({
    defaultValues: {
      account_name: billerData?.account_name,
      account_number: billerData?.account_number,
    },
  });

  const { handleSubmit } = method;

  const router = useRouter();

  const { mutate, isLoading: loading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/billing/scheduled-payment?biller_id=${billerData?.id}`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: () => {
        notify(`Scheduled set successfully`);
        void router.push('/dashboard');
      },
      onError: ({ response }) => {
        notify(`${response?.data?.data?.errors?.scheduled_type}`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => {
    mutate(val);
  };

  return (
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
                      <Text color="primary" fontSize="3xl" fontWeight="bold">
                        S<span style={{ color: 'white' }}>chedule Biller</span>
                      </Text>
                    </Flex>
                  </Flex>
                  <Box textAlign="center">
                    <ScheduleBiller id={billerData?.id} />
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
