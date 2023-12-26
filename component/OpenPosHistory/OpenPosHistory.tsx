import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_POS_HISTORY } from 'constants/api';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC, useState } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const OpenPosHistory: FC = () => {
  const { data } = useQuery('posHistory', FETCH_POS_HISTORY, errorHandler);
  const [seeAll, setSeeAll] = useState(false)
  const router = useRouter()


  return (
    <Box>
      <Flex justifyContent='space-between' alignItems='center' mt='1rem' mb='2rem'>
        <Text fontSize="29px" >
          Open POS
        </Text>

        <Text display={!data?.length ? 'none' : 'block'} fontSize='12px' cursor='pointer' as='u' onClick={(): void => setSeeAll(!seeAll)}>{seeAll ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}</Text>
      </Flex>

      {data?.unpaid_or_open?.length ? (
        <Box>
          {(!seeAll ? data?.unpaid_or_open?.slice(0, 3) : data?.unpaid_or_open).map((item) => (
            <ItemListDisplay
              // label={startCase(item.type)}
              label={!item.paid_po_from ? `PO to ${item.po_to}` : `PO From ${item.po_from}`}
              date={item.created_at}
              amount={item.amount}
              key={item.id}
              complete={item.confirmed}
              image={UnpaidHistoryIcon}
              showBtn
              onClick={(): void => void router.push(`/open-po/${item.id}`)}
            />
          ))}
        </Box>
      ) : (
        <>No Record</>
      )}
    </Box>
  );
};

export default OpenPosHistory;
