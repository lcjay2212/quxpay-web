import { CalendarIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { PayBillsModal, TextField } from 'component';
import { FETCH_BILLER, FETCH_BILLING_CATEGORIES } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BillsIcon, CircleAddIcon } from 'public/assets';
import { FC, useState } from 'react';
import { useDebounce, useHeaderName, usePayBillsModal, useSchedulePayBillModal } from 'store';

export const PayBillsPageWrapper: FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['billingCategories'], queryFn: FETCH_BILLING_CATEGORIES });
  const [searchText, setSearchText] = useState<string>();
  const debounceText = useDebounce(searchText, 1000);
  const { data: billerData, isLoading: loading } = useQuery({
    queryKey: ['biller', debounceText],
    queryFn: FETCH_BILLER,
  });
  const router = useRouter();
  const setHeaderName = useHeaderName((state) => state.setHeaderName);
  const setVisible = useSchedulePayBillModal((state) => state.setVisible);

  const { setPayBillVisible, setPayBillHeaderName, setBillerData } = usePayBillsModal((state) => ({
    setPayBillVisible: state.setVisible,
    setPayBillHeaderName: state.setHeaderName,
    setBillerData: state.setBillerData,
  }));

  return (
    <Box mx="1rem" mt="1rem">
      <TextField
        isSearch
        type="email"
        value={searchText}
        placeholder="Search"
        onChange={(e): void => setSearchText(e.target.value)}
      />

      {loading ? (
        <Box textAlign="center" my="2rem">
          <Spinner size="xl" color="primary" />
        </Box>
      ) : (
        <>
          {!searchText ? (
            <>
              <Flex
                bg="blue.100"
                my="1.5rem"
                borderRadius="20px"
                p="1.5rem"
                color="white"
                justifyContent="space-between"
                alignItems="center"
                onClick={(): void => void router.push('/pay-bills/scheduled-list')}
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
                              <Image
                                src={item?.image || BillsIcon}
                                width={45}
                                height={50}
                                alt={item.id}
                                placeholder="empty"
                              />
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
            </>
          ) : (
            <Box my="2rem">
              {billerData?.map((item) => (
                <Flex
                  key={item.id}
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={(): void => {
                    setBillerData(item);
                    setPayBillHeaderName(item.name);
                    setPayBillVisible(true);
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
                      {item.name}
                    </Text>
                  </Flex>
                  <ChevronRightIcon color="white" w={10} h={10} />
                </Flex>
              ))}
            </Box>
          )}
        </>
      )}
      <PayBillsModal />
    </Box>
  );
};
