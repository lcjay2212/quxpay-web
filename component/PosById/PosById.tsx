/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
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

export const PosById: FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  const router = useRouter();
  const [trigger, setTrigger] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/pay/qr`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          'QuxPay-Web': 1,
          Version: 2,
        },
      }),
    onSuccess: () => {
      setTrigger(!trigger);
    },
    onError: ({ response }: any) => {
      notify(response?.data?.data?.error || `Failed to Pay PO`, { status: 'error' });
    },
  });

  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: () =>
      axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/pos/${data?.id}/delete`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      notify(data.status.message);
      void router.push('/dashboard');
    },
    onError: () => {
      notify(`Failed to Delete PO`, { status: 'error' });
    },
  });

  return (
    <>
      {!trigger ? (
        <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh" px="1rem">
          <Box>
            <Text>Sending to {data?.po_to} for</Text>
            <Text my="0.5rem" ml="1rem">
              PO {data?.id}
            </Text>

            <Label
              label="Token Amount:"
              image="/assets/icons/qux-token.webp"
              amount={data?.amount ?? 0}
              loading={loading}
            />
            <Label
              label="Total Token amount:"
              image="/assets/icons/qux-token.webp"
              amount={data?.total_amount ?? 0}
              loading={loading}
            />
          </Box>

          <Flex alignItems="center" flexDir="column" gap="1rem" my="2rem">
            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              w={350}
              h="3.25rem"
              onClick={(): void => mutate({ qr: data?.qr_id } as any)}
              isLoading={isPending}
            >
              Re-Send PO
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
              isLoading={deleteLoading}
              onClick={(): void => void deleteMutate()}
            >
              Delete PO
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir="column">
          <Box mt="14rem">
            <Image src="/assets/icons/deposit-success.webp" width={100} height={100} placeholder="empty" alt="Redeem" />
          </Box>
          <Flex>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image src="/assets/icons/qux-token.webp" height={30} width={32} alt="Qux Logo" />
            </Box>
            <Text color="white" fontSize="2rem">
              {data?.total_amount.toFixed(2)}
            </Text>
          </Flex>

          <Text color="white" fontSize="20px" textAlign="center" mt="1rem">
            Token Successfully Sent <br /> to {data?.po_to}
          </Text>
          <Button
            variant="primary"
            borderRadius="1rem"
            mt="16rem"
            w={350}
            h="3.25rem"
            onClick={(): void => void router.push('/dashboard')}
          >
            Back Home
          </Button>
        </Flex>
      )}
    </>
  );
};
