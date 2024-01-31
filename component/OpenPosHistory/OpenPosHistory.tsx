import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC, useState } from 'react';
import usePosHistory from 'store/usePosHistory';
import { useUser } from 'store/useUser';

const OpenPosHistory: FC = () => {
  const { unpaidData } = usePosHistory()
  const {user} = useUser()
  const [seeAll, setSeeAll] = useState(false)
  const router = useRouter()


  return (
    <Box>
      <Flex justifyContent='space-between' alignItems='center' mt='1rem' mb='2rem'>
        <Text fontSize="29px" >
         {!user?.corporate ? 'Unpaid POs' : 'Open POs'}
        </Text>

        <Text display={!unpaidData?.length ? 'none' : 'block'} fontSize='12px' cursor='pointer' as='u' onClick={(): void => setSeeAll(!seeAll)}>{seeAll ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}</Text>
      </Flex>

      {unpaidData?.length ? (
        <Box>
          {(!seeAll ? unpaidData?.slice(0, 3) : unpaidData).map((item) => (
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
