import { Box, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY } from 'constants/api';
import { DATE_FORMAT } from 'constants/dateFormat';
import dayjs from 'dayjs';
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
              date={dayjs(item.created_at).format(DATE_FORMAT)}
              amount={item.amount}
              key={item.id}
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
