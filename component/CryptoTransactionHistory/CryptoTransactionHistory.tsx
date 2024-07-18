import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component/ItemListDisplay';
import { FETCH_CRYPTO_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import { CryptoIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { errorHandler } from 'utils';

export const CryptoTransactionHistory: FC = () => {
  const { data, isLoading } = useQuery('crytpoTransactionHistory', FETCH_CRYPTO_TRANSACTION_HISTORY, errorHandler);
  const router = useRouter();

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Crypto Transactions
        </Text>
        <Text fontSize="12px" cursor="pointer" as="u" color="primary" onClick={(): void => void router.push('/crypto')}>
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
              {data?.slice(0, 3).map((item) => (
                <ItemListDisplay
                  label={`${item.currency} ${item.pos_id}`}
                  date={item.created_at}
                  amount={+item.amount}
                  key={item.id}
                  complete={item.confirmed}
                  image={CryptoIcon}
                  type={startCase(item.type)}
                />
              ))}
            </Box>
          ) : (
            <>No Record</>
          )}
        </>
      )}
    </Box>
  );
};
