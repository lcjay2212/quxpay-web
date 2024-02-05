import { Box, Flex, Text } from '@chakra-ui/react';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC } from 'react';
import usePosHistory from 'store/usePosHistory';
import { useUser } from 'store/useUser';

const OpenPosHistory: FC = () => {
  const { unpaidData } = usePosHistory();
  const { user } = useUser();
  const router = useRouter();

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          {!user?.corporate ? 'Unpaid POs' : 'Open POs'}
        </Text>
        <Text fontSize="12px" cursor="pointer" as="u" color="primary">
          View All
        </Text>
      </Flex>

      {unpaidData?.length ? (
        <Box>
          {unpaidData?.slice(0, 3).map((item) => (
            <ItemListDisplay
              // label={startCase(item.type)}
              label={!item.paid_po_from ? `PO to ${item.po_to}` : `PO From ${item.po_from}`}
              date={item.created}
              amount={+item.amount}
              key={item.id}
              complete={item.confirmed}
              image={UnpaidHistoryIcon}
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
