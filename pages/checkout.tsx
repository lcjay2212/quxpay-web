/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_WP_PO_DETAILS } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DepositSuccessful, QuxTokenIcon } from 'public/assets';
import { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRouteParams } from 'store/useRouteParams';
import { useUser } from 'store/useUser';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';
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
  const { data, isLoading } = useQuery(['wpPoDetails', params?.t], FETCH_WP_PO_DETAILS, errorHandler);
  const totalPurchaseAndSubsAmount = data?.recurring_payment_amount + data?.single_purchase_amount;
  const router = useRouter();
  const [successPayment, setSuccessPayment] = useState(false);

  const { user } = useUser();

  console.log(user);

  const {
    mutate,
    isLoading: loading,
    data: paymentData,
  } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/wp/po-paid`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: () => {
        setSuccessPayment(true);
      },
      onError: () => {
        notify(`Failed to pay`, { status: 'error' });
      },
    }
  );

  const tempData = paymentData?.data?.data;

  return (
    <HeaderContainer label="Checkout" route="/dashboard">
      <>
        {successPayment ? (
          <Flex justifyContent="center" alignItems="center" flexDir="column">
            <Box mt="14rem">
              <Image src={DepositSuccessful} width={100} height={100} placeholder="empty" alt="Redeem" />
            </Box>
            <Flex>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image src={QuxTokenIcon} height={30} width={32} alt="Qux Logo" />
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
              onClick={(): void => void router.push('/dashboard')}
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

              {data?.recurring_payment && data?.single_and_recurring_payment && (
                <Label
                  label="Recurring Billing:"
                  image={QuxTokenIcon}
                  amount={data?.recurring_payment_amount}
                  loading={isLoading}
                />
              )}
              {data?.is_single_purchase && data?.single_and_recurring_payment && (
                <Label
                  label="Single Purchase:"
                  image={QuxTokenIcon}
                  amount={data?.single_purchase_amount}
                  loading={isLoading}
                />
              )}
              <Label
                label="Subtotal Token amount:"
                image={QuxTokenIcon}
                amount={totalPurchaseAndSubsAmount}
                loading={isLoading}
              />
              <Label label="Token Fee:" image={QuxTokenIcon} amount={data?.token_fee.toFixed(2)} loading={isLoading} />
              <Label
                label="Total Token amount:"
                image={QuxTokenIcon}
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
