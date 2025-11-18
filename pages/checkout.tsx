/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Progress, Spinner, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HeaderContainer } from 'component';
import { CreditCardModal } from 'component/CreditCardModal';
import { FETCH_WP_PO_DETAILS } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useRouteParams, useUser } from 'store';
import { useCreditCartModal } from 'store/useCreditCartModal';
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
  const { user } = useUser();
  const router = useRouter();
  const params = useRouteParams((e) => e.params);
  const { visible, setVisible } = useCreditCartModal((e) => e);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wpPoDetails', params?.t],
    queryFn: FETCH_WP_PO_DETAILS,
  });

  if (isError) {
    notify(`${error.message}`, { status: 'error' });
  }

  const [successPayment, setSuccessPayment] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  const paymentButton = data?.show_payment_button || 'Send Tokens';

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
    onSuccess: ({ data }) => {
      setSuccessPayment(true);
      setRedirectCountdown(10);

      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            if (data?.data?.redirect) {
              void router.push(data?.data?.redirect);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

  const {
    mutate: autoTopUpMutate,
    isPending: autoTopUpLoading,
    data: autoTopUpPaymentData,
  } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wp/auto-top-up`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      setSuccessPayment(true);
      setRedirectCountdown(10);
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            if (data?.data?.redirect) {
              void router.push(data?.data?.redirect);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

  const handleButtonAction = (): void => {
    switch (paymentButton) {
      case 'Auto Top Up And Send Tokens':
        autoTopUpMutate({ wp: params?.t } as any);
        break;
      case 'Auto Top Up From Default Card and Send Tokens':
        autoTopUpMutate({ wp: params?.t } as any);
        break;
      case 'Send Tokens and Auto Top Up From Default Card':
        autoTopUpMutate({ wp: params?.t } as any);
        break;
      case 'Send Tokens':
        mutate({ wp: params?.t } as any);
        break;
      case 'Add default credit card':
        setVisible(true);
        break;
      default:
        mutate({ wp: params?.t } as any);
    }
  };

  const getButtonVariant = (): 'primary' | 'secondary' => {
    return data?.show_payment_button === 'Add default credit card' ? 'secondary' : 'primary';
  };

  const isButtonLoading =
    paymentButton === 'Auto Top Up And Send Tokens' || paymentButton === 'Auto Top Up From Default Card and Send Tokens'
      ? autoTopUpLoading
      : paymentButton === 'Send Tokens'
      ? loading
      : false;

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

            <Text color="white" fontSize="2rem" fontWeight="bold" mt="1rem">
              You're Almost Done
            </Text>

            <Text color="white" fontSize="20px" textAlign="center" mt="1rem">
              Tokens Being Sent <br /> to {tempData?.sent_to || autoTopUpPaymentData?.data?.data?.sent_to}
            </Text>

            <Text color="white" fontSize="16px" textAlign="center" mt="2rem">
              Redirecting in {redirectCountdown} seconds...
            </Text>

            <Box
              as="button"
              onClick={(): void =>
                void window.open(
                  tempData?.redirect || autoTopUpPaymentData?.data?.data?.redirect,
                  'noopener,noreferrer'
                )
              }
              position="relative"
              mt="2rem"
              w={350}
              h="3.25rem"
              borderRadius="1rem"
              bg="primary.500"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="16px"
              fontWeight="600"
              cursor="pointer"
              _hover={{
                bg: 'primary.600',
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease',
              }}
              transition="all 0.2s ease"
              overflow="hidden"
            >
              <Progress
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                borderRadius="1rem"
                value={((10 - redirectCountdown) / 10) * 100}
                size="lg"
                colorScheme="white"
                bg="white"
                sx={{
                  '& > div': {
                    bg: '#06A499',
                    borderRadius: '1rem',
                  },
                  '& > div > div': {
                    bg: 'white',
                    borderRadius: '1rem',
                  },
                }}
              />

              <Text
                position="relative"
                zIndex="1"
                color={((10 - redirectCountdown) / 10) * 100 > 50 ? 'white' : 'black'}
                fontSize="16px"
                fontWeight="600"
                transition="color 0.3s ease"
              >
                Finishing Order...
              </Text>
            </Box>
          </Flex>
        ) : (
          <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh" px="1rem">
            <Box>
              <Text>Sending to {data?.sending_to} for</Text>
              <Text my="0.5rem" ml="1rem">
                PO {user?.profile_id}
              </Text>

              {/* {(data?.recurring_payment || data?.single_and_recurring_payment) && (
                <Label
                  label="Recurring Billing:"
                  image="/assets/icons/qux-token.webp"
                  amount={data?.recurring_payment_amount}
                  loading={isLoading}
                />
              )} */}
              {/* {(data?.is_single_purchase || data?.single_and_recurring_payment) && (
                <Label
                  label="Single Purchase:"
                  image="/assets/icons/qux-token.webp"
                  amount={data?.single_purchase_amount}
                  loading={isLoading}
                />
              )} */}
              <Label
                label="Available eToken®:"
                image="/assets/icons/qux-token.webp"
                amount={data?.user_current_balance}
                loading={isLoading}
              />
              {data?.products?.map((product) => (
                <Label
                  key={product.id}
                  label={`${product.name} - Quantity: ${product.quantity}`}
                  image="/assets/icons/qux-token.webp"
                  amount={product.product_price}
                  loading={isLoading}
                />
              ))}
              {data?.coupon_details?.map((coupon) => (
                <Label
                  key={coupon.id}
                  label={`CODE:  ${coupon.code}`}
                  image="/assets/icons/qux-token.webp"
                  amount={coupon.discount_amount}
                  loading={isLoading}
                />
              ))}
              <Label
                label="Subtotal eToken® amount:"
                image="/assets/icons/qux-token.webp"
                amount={data?.sub_total}
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
                variant={getButtonVariant()}
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                onClick={handleButtonAction}
                isDisabled={isLoading || isButtonLoading}
              >
                {paymentButton === 'Auto Top Up From Default Card and Send Tokens' ? (
                  <>
                    Auto Top Up From Default Card <br /> and Send Tokens
                  </>
                ) : (
                  <>
                    {paymentButton === 'Send Tokens and Auto Top Up From Default Card' ? (
                      <>
                        Send Tokens and Auto Top Up <br /> From Default Card
                      </>
                    ) : (
                      paymentButton
                    )}
                  </>
                )}
              </Button>

              <Button
                type="submit"
                variant="secondary"
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                onClick={(): void => void router.push('/dashboard')}
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
        {visible && <CreditCardModal />}
      </>
    </HeaderContainer>
  );
};

export default CheckoutPage;
