import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, SchedulePayBillModal, TextField } from 'component';
import { FETCH_BILLER_BY_CATEGORY_ID } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BillsIcon } from 'public/assets';
import { FC } from 'react';
import { useHeaderName, useSchedulePayBillModal } from 'store';

const PayBillsByCategory: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['posHistoryById', router.query.id],
    queryFn: FETCH_BILLER_BY_CATEGORY_ID,
  });
  const headerName = useHeaderName((state) => state.headerName);
  const { setVisible, setHeaderName, setBillerData } = useSchedulePayBillModal((state) => ({
    setVisible: state.setVisible,
    setHeaderName: state.setHeaderName,
    setBillerData: state.setBillerData,
  }));
  return (
    <HeaderContainer label={headerName} route="/pay-bills">
      <Box mx="1rem" mt="1rem">
        <TextField isSearch type="email" value={''} placeholder="Search" />
        {isLoading ? (
          <Box textAlign="center" my="3rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <Box my="2rem">
            {data?.saved_payment_infos?.map((item) => (
              <Flex
                key={item.id}
                justifyContent="space-between"
                alignItems="center"
                onClick={(): void => {
                  setBillerData(item);
                  setHeaderName(item.biller_name);
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
                    {item.biller_name}
                  </Text>
                </Flex>
                <ChevronRightIcon color="white" w={10} h={10} />
              </Flex>
            ))}
          </Box>
        )}
        <SchedulePayBillModal />
      </Box>
    </HeaderContainer>
  );
};

export default PayBillsByCategory;
