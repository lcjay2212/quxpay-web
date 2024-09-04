import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { SuccessCircleIcon } from 'public/assets';
import { FC } from 'react';
import { useSuccessPayBillsModal } from 'store';
import { notify } from 'utils';

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

export const SuccessPayBillModal: FC<{ data?: TempDataType }> = ({ data }) => {
  const [visible, setVisible] = useSuccessPayBillsModal((state) => [state.visible, state.setVisible]);

  const { mutate: savePayment, isPending: savePaymentLoading } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/billing/save-info`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify('Saved payment info successfully');
      setVisible(false);
    },
    onError: () => {
      notify(`Error`, { status: 'error' });
    },
  });

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Box>
            <ArrowBackIcon mt="1rem" color="white" mr="1rem" cursor="pointer" onClick={(): void => setVisible(false)} />
            <Flex display="column" textAlign="center" my="6rem" color="white">
              <Flex justifyContent="center">
                <Image src={SuccessCircleIcon} width={80} height={80} alt="success" />
              </Flex>
              <Text fontSize="1.5rem" fontWeight="bold" color="primary" mt="1rem">
                Payment Received
              </Text>
              <Text fontWeight="bold">{data?.biller_name}</Text>
              <Text fontWeight="bold" fontSize="2rem">
                {data?.total_amount?.toFixed(2)}
              </Text>
              <Divider mt="1rem" mb="2rem" />
              <Flex justifyContent="space-between">
                <Text>Account Number</Text>
                <Text>{data?.reference_number}</Text>
              </Flex>
              <Flex justifyContent="space-between" mt="1rem">
                <Text>Account Name</Text>
                <Text>{data?.account_name}</Text>
              </Flex>
              <Flex justifyContent="space-between" my="1rem">
                <Text>Amount Paid</Text>
                <Text>{data?.amount_paid?.toFixed(2)}</Text>
              </Flex>
              <Flex justifyContent="space-between" mb="1rem">
                <Text>Fee</Text>
                <Text>{data?.fee?.toFixed(2)}</Text>
              </Flex>
              <Divider mt="1rem" mb="2rem" />
              <Text fontSize="12px">Ref. No. 12345 6780 9</Text>
              <Text fontSize="12px" mt="1rem" mb="2rem">
                {data?.date}
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
                    account_number: data?.account_number,
                    account_name: data?.account_name,
                    biller_category_id: data?.biller_category_id,
                    biller_id: data?.biller_id,
                    tag: 'Service',
                  } as any)
                }
              >
                Save to biller list
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
