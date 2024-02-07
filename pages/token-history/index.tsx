import { Box, Spinner } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC } from 'react';
import usePosHistory from 'store/usePosHistory';
import { useUser } from 'store/useUser';

const PaidPosHistory: FC = () => {
  const { paidData, isLoading } = usePosHistory();
  const { user } = useUser();
  const router = useRouter();

  return (
    <HeaderContainer label={!user?.corporate ? 'Unpaid POs' : 'Open POs'} route="/dashboard">
      <Box my="1rem">
        {isLoading ? (
          <Box textAlign="center" py="2rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <>
            {paidData?.length ? (
              <Box>
                {paidData?.map((item) => (
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
          </>
        )}
      </Box>
    </HeaderContainer>
  );
};

export default PaidPosHistory;
