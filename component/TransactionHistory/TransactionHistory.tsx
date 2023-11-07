import { Box, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const TransactionHistory: FC = () => {
  const { data } = useQuery('transactionHistory', FETCH_TRANSACTION_HISTORY, errorHandler);

  return (
    <Box maxH="100vh">
      <Text fontSize="3xl" fontWeight="bold" mb="2rem" mt="1rem">
        Transaction History
      </Text>

      {data?.length ? (
        <Box>
          {data.map((item) => (
            <ItemListDisplay
              type={startCase(item.type)}
              date={item.created_at}
              amount={item.amount}
              key={item.id}
              complete={item.confirmed}
            />
          ))}
        </Box>
      ) : (
        <>No Record</>
      )}
    </Box>
  );
};

export default TransactionHistory;
