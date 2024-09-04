import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { NotificationListDisplay } from 'component';
import { FETCH_NOTIFICATION_HISTORY } from 'constants/api';
import { useRouter } from 'next/router';
import { FC } from 'react';

export const NotificationHistory: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({ queryKey: ['notificationHistory'], queryFn: FETCH_NOTIFICATION_HISTORY });

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Notification
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/notification')}
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
          {data?.length ? (
            <Box>
              {data?.slice(0, 3).map((item) => (
                <NotificationListDisplay
                  title={item.title}
                  date={item.created_at}
                  key={item.id}
                  message={item.message}
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
