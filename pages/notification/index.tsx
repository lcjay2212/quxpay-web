import { Box, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, NotificationListDisplay } from 'component';
import { FETCH_NOTIFICATION_HISTORY } from 'constants/api';
import { FC } from 'react';
import { DATE_FORMATS, dayjsUtils } from 'utils';

const NotificationList: FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['notificationHistory'], queryFn: FETCH_NOTIFICATION_HISTORY });

  return (
    <HeaderContainer label="Notification" route="/dashboard">
      <Box bg="blue.100" mt="2rem" px="1rem" py="1.5rem" minH="100vh" borderTopRadius="32px">
        {isLoading ? (
          <Box textAlign="center" py="2rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <Box>
            {data?.map((item) => (
              <NotificationListDisplay
                title={item.title}
                date={dayjsUtils.formatUTC(item.created_at, DATE_FORMATS.FULL_DATE_TIME_UTC)}
                key={item.id}
                message={item.message}
              />
            ))}
          </Box>
        )}
      </Box>
    </HeaderContainer>
  );
};

export default NotificationList;
