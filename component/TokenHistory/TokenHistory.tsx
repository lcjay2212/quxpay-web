import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { useRouter } from 'next/router';
import { TokenHistoryGreenIcon, TokenHistoryIcon } from 'public/assets';
import { FC, useState } from 'react';
import usePosHistory from 'store/usePosHistory';

const TokenHistory: FC = () => {
  const { paidData } = usePosHistory()
  const [seeAll, setSeeAll] = useState(false)
  const router = useRouter()

  return (
    <Box>
      <Flex justifyContent='space-between' alignItems='center' mt='1rem' mb='2rem'>
        <Text fontSize="29px" >
          Token History
        </Text>

        <Text display={!paidData?.length ? 'none' : 'block'} fontSize='12px' cursor='pointer' as='u' onClick={(): void => setSeeAll(!seeAll)}>{seeAll ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}</Text>
      </Flex>

      {paidData?.length ? (
        <Box>
          {(!seeAll ? paidData?.slice(0, 3) : paidData)?.map((item) => (
            <ItemListDisplay
              label={!item.paid_po_from ? `PO Paid to ${item.po_to}` : item.transaction_upload ? `PO Paid By ${item.po_from} (CSV Upload)` : `PO ${item.id} Paid By ${item.po_from}`}
              date={item.created_at}
              amount={item.amount}
              key={item.id}
              complete={item.confirmed}
              image={!item.paid_po_from ? TokenHistoryIcon : TokenHistoryGreenIcon}
              showBtn
              onClick={(): void => void router.push(`/token-history/${item.id}`)}
            />
          ))}
        </Box>
      ) : (
        <>No Record</>
      )}
    </Box>
  );
};

export default TokenHistory;
