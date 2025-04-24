import { Box, Button, Divider, Flex, Image as ChakraImage, Text } from '@chakra-ui/react';
import { Label } from 'component';
import { useRouter } from 'next/router';
import { FC } from 'react';

export const PaidPosInfoById: FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  const router = useRouter();
  return (
    <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh" px="1rem">
      <Box>
        <Text>
          Sending{' '}
          {data?.paid_po_to
            ? `to ${data?.po_to} for`
            : data?.transaction_upload
            ? `from ${data?.po_from}`
            : `for ${data?.po_from} to`}
        </Text>
        {data?.transaction_upload ? (
          <Box mb="1rem">
            <Text>(CSV Upload on {data.csv_upload_date})</Text>
            <Text>Account: {data.account_number}</Text>
            <Text>Bank Name: {data.bank_name}</Text>
          </Box>
        ) : (
          <Text my="0.5rem" ml="1rem">
            PO {data?.id}
          </Text>
        )}

        <Label label="Token Amount:" image="/assets/icons/qux-token.webp" amount={data?.amount} loading={loading} />
        <Label
          label="QUX eToken® Fee:"
          image="/assets/icons/qux-token.webp"
          amount={data?.token_fee}
          loading={loading}
        />
        <Label
          label="Total Token amount:"
          image="/assets/icons/qux-token.webp"
          amount={data?.total_amount}
          loading={loading}
        />

        <Box mt="2rem">
          {data?.selected_products?.map((item) => (
            <>
              <Flex height={100} justifyContent="space-between" key={item.id}>
                <Flex gap={4}>
                  <Box height={80}>
                    <ChakraImage src={`${item.product_image}`} height="80px" width="80px" alt={item.product} />
                  </Box>
                  <Box fontSize="18px">
                    <Text mb="0.5rem">Q{item.product}</Text>
                    <Text>Variation: {item.variation}</Text>
                  </Box>
                </Flex>
              </Flex>
              <Divider />
            </>
          ))}
        </Box>
      </Box>

      <Flex alignItems="center" flexDir="column" gap="1rem" my="2rem">
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
      </Flex>
    </Flex>
  );
};
