import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useUser } from 'store';
import { queryClient } from 'utils';

export const OpenPosHistory: FC<{ loading: boolean }> = ({ loading }) => {
  const data = queryClient.getQueryData<{ unpaid_or_open: PosHistoryProps[] }>(['posHistory']);
  const { user } = useUser();
  const router = useRouter();

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          {!user?.corporate ? 'Unpaid POs' : 'Open POs'}
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/open-po')}
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
          {data?.unpaid_or_open.length ? (
            <Box>
              {data.unpaid_or_open.slice(0, 3).map((item) => (
                <ItemListDisplay
                  // label={startCase(item.type)}
                  label={item.label}
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  // complete={item.confirmed}
                  image="/assets/icons/unpaid-history-icon.webp"
                  onClick={(): void => void router.push(`/open-po/${item.id}`)}
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
