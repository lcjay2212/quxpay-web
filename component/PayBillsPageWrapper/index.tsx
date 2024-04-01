import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import SchedulePayBillModal from 'component/SchedulePayBillModal';
import { TextField } from 'component/TextField';
import { FETCH_BILLING_CATEGORIES } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BillsIcon, CircleAddIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useHeaderName } from 'store/useHeaderName';
import { useSchedulePayBillModal } from 'store/useSchedulePayBillModal';
import errorHandler from 'utils/errorHandler';

const PayBillsPageWrapper: FC = () => {
  const { data, isLoading } = useQuery('billingCategories', FETCH_BILLING_CATEGORIES, errorHandler);
  const router = useRouter();
  const setHeaderName = useHeaderName((state) => state.setHeaderName);
  const setVisible = useSchedulePayBillModal((state) => state.setVisible);

  return (
    <Box mx="1rem" mt="1rem">
      <TextField isSearch type="email" value={''} placeholder="Search" />

      <Flex
        bg="blue.100"
        my="1.5rem"
        borderRadius="20px"
        p="1.5rem"
        color="white"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex gap={4} justifyContent="center" alignItems="center">
          <CalendarIcon width={25} height={25} />
          <Text fontSize="14px">Schedule Bill Payments</Text>
        </Flex>

        <Box cursor="pointer" onClick={(): void => setVisible(true)}>
          <Image src={CircleAddIcon} alt="Add Icon" />
        </Box>
      </Flex>

      <Box bg="blue.100" borderRadius="20px" p="1.5rem">
        {isLoading ? (
          <Box textAlign="center">
            <Spinner size="xl" color="primary" />
          </Box>
        ) : (
          <>
            {!data?.length ? (
              <Box color="white" textAlign="center">
                No Billing Categories yet
              </Box>
            ) : (
              <Grid templateColumns="repeat(4, 1fr)" gap={{ base: 2, md: 6 }}>
                {data?.map((item) => (
                  <Flex
                    flexDir="column"
                    key={item.id}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{
                      color: 'primary',
                    }}
                    id={item.id}
                    onClick={(): void => {
                      setHeaderName(item.name);
                      void router.push(`/pay-bills/${item.id}`);
                    }}
                  >
                    <Flex justifyContent="center" width="auto" height={50}>
                      <Image src={BillsIcon} width={45} height={50} alt={item.id} placeholder="empty" />
                    </Flex>
                    <Text color="white" mt="0.5rem" fontSize={{ base: '0.75rem', md: '1rem' }}>
                      {item.name}
                    </Text>
                  </Flex>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      <SchedulePayBillModal />
    </Box>
  );
};

export default PayBillsPageWrapper;
