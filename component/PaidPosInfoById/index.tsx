import { Box, Button, Divider, Flex, Image as ChakraImage, Spinner, Text } from '@chakra-ui/react';
import QuxTokenFeeModal from 'component/QuxTokenFeeModal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxTokenIcon } from 'public/assets';
import { FC } from 'react';
import { useQuxPayFeeModal } from 'store/useQuxPayFeeModal';

export const Label: FC<{ label: string; image: any; amount: number; loading: boolean }> = ({
  label,
  image,
  amount,
  loading,
}) => {
  const [visible, setVisible] = useQuxPayFeeModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <>
      <Flex fontSize="18px" justifyContent="space-between" alignItems="center" mt="0.5rem">
        <Flex>
          <Text w="auto">{label}</Text>&nbsp;
          {label === 'Token Fee:' && (
            <Text
              bg="gray"
              borderRadius="50%"
              w="20px"
              h="20px"
              textAlign="center"
              fontSize="12px"
              color="black"
              mt="4px"
              fontWeight="bold"
              pt="1px"
              cursor="pointer"
              onClick={(): void => setVisible(!visible)}
            >
              ?
            </Text>
          )}
        </Flex>
        <Flex>
          <span>
            <Image src={image} width={24} height={20} alt="Qux Token" />
          </span>
          {!loading ? <> {amount}</> : <Spinner />}
        </Flex>
      </Flex>
      <QuxTokenFeeModal />
    </>
  );
};

const PaidPosInfoById: FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  const router = useRouter();
  return (
    <>
      <Flex flexDir="column" justifyContent="space-between" color="white" mt="2rem" h="85vh">
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

          <Label label="Token Amount:" image={QuxTokenIcon} amount={data?.amount} loading={loading} />
          <Label label="Token Fee:" image={QuxTokenIcon} amount={data?.token_fee} loading={loading} />
          <Label label="Total Token amount:" image={QuxTokenIcon} amount={data?.total_amount} loading={loading} />

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
    </>
  );
};

export default PaidPosInfoById;
