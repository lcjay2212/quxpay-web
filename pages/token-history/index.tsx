import { Box, Spinner } from '@chakra-ui/react';
import { HeaderContainer, ItemListDisplay } from 'component';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC } from 'react';
import { usePosHistory } from 'store';

const TokenHistoryPage: FC = () => {
  const { paidData, isLoading } = usePosHistory();
  const router = useRouter();

  return (
    <HeaderContainer label="Token History" route="/dashboard">
      <Box my="1rem" px="1rem">
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

export default TokenHistoryPage;
