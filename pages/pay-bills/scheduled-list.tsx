import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import SchedulePayBillModal from 'component/SchedulePayBillModal';
import { TextField } from 'component/TextField';
import { FETCH_SCHEDULED_PAYMENT_LISTS } from 'constants/api';
import Image from 'next/image';
import { BillsIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useSchedulePayBillModal } from 'store/useSchedulePayBillModal';
import errorHandler from 'utils/errorHandler';

const ScheduledList: FC = () => {
  const { data, isLoading } = useQuery('scheduledList', FETCH_SCHEDULED_PAYMENT_LISTS, errorHandler);

  const { setVisible, setHeaderName, setBillerData } = useSchedulePayBillModal((state) => ({
    setVisible: state.setVisible,
    setHeaderName: state.setHeaderName,
    setBillerData: state.setBillerData,
  }));

  return (
    <HeaderContainer label="Biller Lists" route="/dashboard">
      <Box mx="1rem" mt="1rem">
        <TextField isSearch placeholder="Search" />

        {isLoading ? (
          <Box textAlign="center" my="2rem">
            <Spinner size="xl" color="primary" />
          </Box>
        ) : (
          <>
            <Box my="2rem">
              {data?.map((item) => (
                <Flex
                  key={item.id}
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={(): void => {
                    setBillerData(item);
                    setHeaderName(item.name);
                    setVisible(true);
                  }}
                >
                  <Flex justifyContent="center" alignItems="center">
                    <Flex justifyContent="center" width="auto" height={50}>
                      <Image
                        src={BillsIcon}
                        width={100}
                        height={100}
                        alt={item.id}
                        style={{
                          objectFit: 'fill',
                        }}
                        placeholder="empty"
                      />
                    </Flex>
                    <Text color="white" fontWeight="semibold" fontSize="14px">
                      {item.biller}
                    </Text>
                  </Flex>
                  <ChevronRightIcon color="white" w={10} h={10} />
                </Flex>
              ))}
            </Box>
          </>
        )}
        <SchedulePayBillModal />
      </Box>
    </HeaderContainer>
  );
};

export default ScheduledList;
