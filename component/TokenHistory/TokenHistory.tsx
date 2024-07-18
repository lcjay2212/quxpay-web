import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component/ItemListDisplay';
import { useRouter } from 'next/router';
import { TokenHistoryGreenIcon, TokenHistoryIcon } from 'public/assets';
import { FC } from 'react';
import { usePosHistory } from 'store';

export const TokenHistory: FC = () => {
  const { paidData, isLoading } = usePosHistory();
  const router = useRouter();
  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Token History
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/token-history')}
        >
          View All
        </Text>
      </Flex>

      {isLoading ? (
        <Box textAlign="center" py="2rem">
          <Spinner color="primary" size="xl" />
        </Box>
      ) : (
        <>
          {paidData?.length ? (
            <Box>
              {paidData?.slice(0, 3)?.map((item) => (
                <ItemListDisplay
                  label={
                    !item.paid_po_from
                      ? `PO Paid to ${item.po_to}`
                      : item.transaction_upload
                      ? `PO Paid By ${item.po_from} (CSV Upload)`
                      : `PO ${item.id} Paid By ${item.po_from}`
                  }
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  complete={item.confirmed}
                  image={!item.paid_po_from ? TokenHistoryIcon : TokenHistoryGreenIcon}
                  onClick={(): void => void router.push(`/token-history/${item.id}`)}
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
