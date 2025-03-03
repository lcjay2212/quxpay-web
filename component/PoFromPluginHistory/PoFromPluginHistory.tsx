import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component';
import { useRouter } from 'next/router';
import { UnpaidHistoryIcon } from 'public/assets';
import { FC } from 'react';
import { queryClient } from 'utils';

export const PoFromPluginHistory: FC<{ loading: boolean }> = ({ loading }) => {
  const data = queryClient.getQueryData<{ test_po_from_plugin: PosHistoryProps[] }>(['posHistory']);
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

      {loading ? (
        <Box textAlign="center" py="2rem">
          <Spinner color="primary" size="xl" />
        </Box>
      ) : (
        <>
          {data?.test_po_from_plugin.length ? (
            <Box>
              {data.test_po_from_plugin.slice(0, 3).map((item) => (
                <ItemListDisplay
                  // label={startCase(item.type)}
                  label={item.label}
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  // complete={item.confirmed}
                  image={UnpaidHistoryIcon}
                  // onClick={(): void => void router.push(`/open-po/${item.id}`)}
                  type={item.type}
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
