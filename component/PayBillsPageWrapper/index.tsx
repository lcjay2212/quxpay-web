import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { TextField } from 'component/TextField';
import { FETCH_BILLING_CATEGORIES } from 'constants/api';
import Image from 'next/image';
import { BillsIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const PayBillsPageWrapper: FC = () => {
  const { data, isLoading } = useQuery('billingCategories', FETCH_BILLING_CATEGORIES, errorHandler);

  return (
    <Box mx="1rem" mt="1rem">
      <TextField isSearch type="email" value={''} placeholder="Search" />

      <Box bg="blue.100" my="2rem" borderRadius="20px" p="1.5rem">
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
    </Box>
  );
};

export default PayBillsPageWrapper;
