import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_WP_PO_DETAILS } from 'constants/api';
import Image from 'next/image';
import { QuxTokenIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useRouteParams } from 'store/useRouteParams';
import errorHandler from 'utils/errorHandler';
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

  return (
    <HeaderContainer label="Checkout" route="/dashboard">
      <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh" px="1rem">
        <Box>
          <Text>Sending to {data?.sending_to} for</Text>
          <Text my="0.5rem" ml="1rem">
            PO {data?.id}
          </Text>

          {data?.recurring_payment && (
            <Label
              label="Recurring Billing:"
              image={QuxTokenIcon}
              amount={data?.recurring_payment_amount}
              loading={isLoading}
            />
          )}
          {data?.is_single_purchase && (
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
            // onClick={(): void => mutate({ qr: data?.qr_id } as any)}
            isLoading={isLoading}
          >
            Re-Send PO
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
    </HeaderContainer>
  );
};

export default CheckoutPage;
