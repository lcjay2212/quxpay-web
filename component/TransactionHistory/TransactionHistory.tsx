import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const TransactionHistory: FC = () => {
  const { data, isLoading } = useQuery('transactionHistory', FETCH_TRANSACTION_HISTORY, errorHandler);
  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Transaction
        </Text>
        <Text fontSize="12px" cursor="pointer" as="u" color="primary">
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
                  label={`Qux User ${startCase(item.type)}`}
                  date={item.created_at}
                  amount={+item.amount}
                  key={item.id}
                  complete={item.confirmed}
                  image={QuxWalletIcon}
                  hasComplete
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

export default TransactionHistory;
