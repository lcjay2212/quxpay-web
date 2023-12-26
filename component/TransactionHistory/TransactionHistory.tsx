import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { QuxWalletIcon } from 'public/assets';
import { FC, useState } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const TransactionHistory: FC = () => {
  const { data } = useQuery('transactionHistory', FETCH_TRANSACTION_HISTORY, errorHandler);
  const [seeAll, setSeeAll] = useState(false)

  return (
    <Box >
      <Flex justifyContent='space-between' alignItems='center' mt='1rem' mb='2rem'>
        <Text fontSize="29px" >
          Transaction History
        </Text>

        <Text display={!data?.length ? 'none' : 'block'} fontSize='12px' cursor='pointer' as='u' onClick={(): void => setSeeAll(!seeAll)}>{seeAll ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}</Text>
      </Flex>

      {data?.length ? (
        <Box>
          {(!seeAll ? data?.slice(0, 3) : data).map((item) => (
            <ItemListDisplay
              label={`Qux User ${startCase(item.type)}`}
              date={item.created_at}
              amount={item.amount}
              key={item.id}
              complete={item.confirmed}
              image={QuxWalletIcon}
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
