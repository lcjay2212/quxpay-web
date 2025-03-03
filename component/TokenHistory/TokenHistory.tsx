import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { ItemListDisplay } from 'component';
import { useRouter } from 'next/router';
import { TokenHistoryGreenIcon, TokenHistoryIcon } from 'public/assets';
import { FC } from 'react';
import { queryClient } from 'utils';

export const TokenHistory: FC<{ loading: boolean }> = ({ loading }) => {
  const data = queryClient.getQueryData<{ paid: PosHistoryProps[] }>(['posHistory']);
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

      {loading ? (
        <Box textAlign="center" py="2rem">
          <Spinner color="primary" size="xl" />
        </Box>
      ) : (
        <>
          {data?.paid.length ? (
            <Box>
              {data.paid.slice(0, 3).map((item) => (
                <ItemListDisplay
                  label={item.label}
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  // complete={item.confirmed}
                  image={item.type === 'Created' ? TokenHistoryIcon : TokenHistoryGreenIcon}
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
