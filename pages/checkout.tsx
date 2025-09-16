/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HeaderContainer } from 'component';
import { FETCH_WP_PO_DETAILS } from 'constants/api';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useRouteParams, useUser } from 'store';
import { notify } from 'utils';
const Label: FC<{ label: string; image: any; amount: number; loading: boolean }> = ({
  label,
  image,
  amount,
  loading,
}) => (
  <Flex fontSize="18px" justifyContent="space-between" alignItems="center" mt="0.5rem">
    <Text w="auto">{label}</Text>&nbsp;
    <Flex>
      <span>
        <Image src={image} width={24} height={20} alt="Qux Token" />
      </span>
      {!loading ? <> {amount}</> : <Spinner />}
    </Flex>
  </Flex>
);

const CheckoutPage: FC = () => {
  const params = useRouteParams((e) => e.params);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wpPoDetails', params?.t],
    queryFn: FETCH_WP_PO_DETAILS,
  });

  if (isError) {
    notify(`${error.message}`, { status: 'error' });
    // setTimeout(() => {
    //   window.location.replace(`${error?.data?.data?.return_url}`);
    // }, 5000);
  }

  const totalPurchaseAndSubsAmount = data?.recurring_payment_amount + data?.single_purchase_amount;
  const [successPayment, setSuccessPayment] = useState(false);

  const { user } = useUser();

  const {
    mutate,
    isPending: loading,
    data: paymentData,
  } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wp/po-paid`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      setSuccessPayment(true);
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

  const tempData = paymentData?.data?.data;

  return (
    <HeaderContainer label="Checkout" route="/dashboard">
      <>
        {successPayment ? (
          <Flex justifyContent="center" alignItems="center" flexDir="column">
            <Box mt="14rem">
              <Image
                src="/assets/icons/deposit-success.webp"
                width={100}
                height={100}
                placeholder="empty"
                alt="Redeem"
              />
            </Box>
            <Flex>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image src="/assets/icons/qux-token.webp" height={30} width={32} alt="Qux Logo" />
              </Box>
              <Text color="white" fontSize="2rem">
                {tempData?.total_payment.toFixed(2)}
              </Text>
            </Flex>

            <Text color="white" fontSize="20px" textAlign="center" mt="1rem">
              Token Successfully Sent <br /> to {tempData?.sent_to}
            </Text>
            <Button
              variant="primary"
              borderRadius="1rem"
              mt="16rem"
              w={350}
              h="3.25rem"
              onClick={(): void => void window.open(tempData?.redirect, 'noopener,noreferrer')}
            >
              Back to Site
            </Button>
          </Flex>
        ) : (
          <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh" px="1rem">
            <Box>
              <Text>Sending to {data?.sending_to} for</Text>
              <Text my="0.5rem" ml="1rem">
                PO {user?.profile_id}
              </Text>

              {(data?.recurring_payment || data?.single_and_recurring_payment) && (
                <Label
                  label="Recurring Billing:"
                  image="/assets/icons/qux-token.webp"
                  amount={data?.recurring_payment_amount}
                  loading={isLoading}
                />
              )}
              {(data?.is_single_purchase || data?.single_and_recurring_payment) && (
                <Label
                  label="Single Purchase:"
                  image="/assets/icons/qux-token.webp"
                  amount={data?.single_purchase_amount}
                  loading={isLoading}
                />
              )}
              <Label
                label="Subtotal eToken® amount:"
                image="/assets/icons/qux-token.webp"
                amount={totalPurchaseAndSubsAmount}
                loading={isLoading}
              />
              <Label
                label="QUX eToken® Fee:"
                image="/assets/icons/qux-token.webp"
                amount={data?.token_fee.toFixed(2)}
                loading={isLoading}
              />
              <Label
                label="Total eToken® amount:"
                image="/assets/icons/qux-token.webp"
                amount={data?.total_token_amount}
                loading={isLoading}
              />
            </Box>

            <Flex alignItems="center" flexDir="column" gap="1rem" my="2rem">
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                onClick={(): void => mutate({ wp: params?.t } as any)}
                isLoading={loading}
              >
                Send Tokens
              </Button>

              <Button
                type="submit"
                variant="secondary"
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                // onClick={(): void => void router.push('/dashboard')}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="delete"
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                //   isLoading={deleteLoading}
                //   onClick={(): void => void deleteMutate()}
              >
                Delete PO
              </Button>
            </Flex>
          </Flex>
        )}
      </>
    </HeaderContainer>
  );
};

export default CheckoutPage;
