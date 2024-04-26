import { Box, Spinner } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import NotificationListDisplay from 'component/NotificationListDisplay/NotificationListDisplay';
import { FETCH_NOTIFICATION_HISTORY } from 'constants/api';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const NotificationList: FC = () => {
  const { data, isLoading } = useQuery('notificationHistory', FETCH_NOTIFICATION_HISTORY, errorHandler);

  return (
    <HeaderContainer label="Notification" route="/dashboard">
      <Box bg="blue.100" mt="2rem" px="1rem" py="1.5rem" h="100vh" borderTopRadius="32px">
        {isLoading ? (
          <Box textAlign="center" py="2rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <Box>
            {data?.map((item) => (
              <NotificationListDisplay title={item.title} date={item.created_at} key={item.id} message={item.message} />
            ))}
          </Box>
        )}
      </Box>
    </HeaderContainer>
  );
};

export default NotificationList;
