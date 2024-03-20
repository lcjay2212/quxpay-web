import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import { TextField } from 'component/TextField';
import { FETCH_BILLER_BY_CATEGORY_ID } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BillsIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { useHeaderName } from 'store/useHeaderName';
import errorHandler from 'utils/errorHandler';

const PayBillsByCategory: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery(['posHistoryById', router.query.id], FETCH_BILLER_BY_CATEGORY_ID, errorHandler);
  const name = useHeaderName((state) => state.name);

  return (
    <HeaderContainer label={name} route="/pay-bills">
      <Box mx="1rem" mt="1rem">
        <TextField isSearch type="email" value={''} placeholder="Search" />
        {isLoading ? (
          <Box textAlign="center" my="3rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <Box my="2rem">
            {data?.map((item) => (
              <Flex key={item.id} justifyContent="space-between" alignItems="center">
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
      </Box>
    </HeaderContainer>
  );
};

export default PayBillsByCategory;
