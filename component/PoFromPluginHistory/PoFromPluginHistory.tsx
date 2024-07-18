import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC } from 'react';
import { usePosHistory } from 'store';

export const PoFromPluginHistory: FC = () => {
  const { pluginData, isLoading } = usePosHistory();
  const router = useRouter();

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          PO from Plugin
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/plugin-po')}
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
          {pluginData?.length ? (
            <Box>
              {pluginData?.slice(0, 3).map((item) => (
                <ItemListDisplay
                  // label={startCase(item.type)}
                  label={!item.paid_po_from ? `PO to ${item.po_to}` : `PO From ${item.po_from}`}
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  complete={item.confirmed}
                  image={UnpaidHistoryIcon}
                  // onClick={(): void => void router.push(`/open-po/${item.id}`)}
                  type={!item.paid_po_from ? 'Created' : 'Received'}
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
