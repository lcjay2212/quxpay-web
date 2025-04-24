import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, SchedulePayBillModal, TextField } from 'component';
import { FETCH_SCHEDULED_PAYMENT_LISTS } from 'constants/api';
import Image from 'next/image';
import { FC } from 'react';
import { useSchedulePayBillModal } from 'store';

const ScheduledList: FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['scheduledList'], queryFn: FETCH_SCHEDULED_PAYMENT_LISTS });

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
              {!data?.length ? (
                <>No Biller List Yet</>
              ) : (
                <>
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
                            src="/assets/icons/bills.webp"
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
                </>
              )}
            </Box>
          </>
        )}
        <SchedulePayBillModal />
      </Box>
    </HeaderContainer>
  );
};

export default ScheduledList;
