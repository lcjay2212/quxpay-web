import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY_PHASE_TWO } from 'constants/api';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
// import { usePrivatekey } from 'store/usePrivatekey';
import { errorHandler } from 'utils';

export const TransactionHistory: FC = () => {
  const { data, isLoading } = useQuery('transactionHistory', FETCH_TRANSACTION_HISTORY_PHASE_TWO, errorHandler);
  const router = useRouter();
  // const privatekey = usePrivatekey((state) => state.privatekey);

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Transactions
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/transaction')}
        >
          View All
        </Text>
      </Flex>

      {isLoading ? (
        <Box textAlign="center" py="2rem">
          <Spinner color="primary" size="xl" />
        </Box>
      ) : (
        <>
          {data?.length ? (
            <Box>
              {data?.slice(0, 3).map((item) => {
                // const amount = item.amount;
                // const privateKey = new NodeRSA(privatekey);
                // const decryptedData = privateKey.decrypt(amount, 'utf8');
                return (
                  <ItemListDisplay
                    label={`QUX® User ${startCase(item.type)}`}
                    date={item.created_at}
                    amount={+item.amount}
                    key={item.id}
                    complete={item.confirmed}
                    image={QuxWalletIcon}
                    hasComplete
                  />
                );
              })}
            </Box>
          ) : (
            <>No Record</>
          )}
        </>
      )}
    </Box>
  );
};
