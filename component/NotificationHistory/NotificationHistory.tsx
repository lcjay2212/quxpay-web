import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { NotificationListDisplay } from 'component';
import { FETCH_NOTIFICATION_HISTORY } from 'constants/api';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { errorHandler } from 'utils';

export const NotificationHistory: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery('notificationHistory', FETCH_NOTIFICATION_HISTORY, errorHandler);

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
