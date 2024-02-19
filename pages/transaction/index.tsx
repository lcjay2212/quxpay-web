import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { TextField } from 'component/TextField';
import { FETCH_TRANSACTION_HISTORY_PHASE_TWO } from 'constants/api';
import { startCase } from 'lodash';
import NodeRSA from 'node-rsa';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { BsBank2 } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { secretKey } from 'utils/secretKey';
const TransactionHistoryPage: FC = () => {
  const { data, isLoading } = useQuery('transactionHistoryPhaseTwo', FETCH_TRANSACTION_HISTORY_PHASE_TWO, errorHandler);
  return (
    <HeaderContainer label="Transaction" route="/dashboard">
      <>
        <Box mx="1rem" mt="1rem">
          <TextField
            isSearch
            type="email"
            value={''}
            placeholder="Search"
            // eslint-disable-next-line no-console
            onChange={(e): void => console.log(e.target.value)}
          />

          <Flex mt="1rem" gap={3} justifyContent="center">
            <Button
              leftIcon={<CalendarIcon />}
              bg="blue.100"
              size="sm"
              color="white"
              _hover={{ bg: 'blue.100' }}
              borderRadius="xl"
            >
              Date
            </Button>
            <Button
              leftIcon={<BsBank2 />}
              bg="blue.100"
              size="sm"
              color="white"
              _hover={{ bg: 'blue.100' }}
              borderRadius="xl"
            >
              Transaction
            </Button>
            <Button
              leftIcon={<FaEllipsisH />}
              bg="blue.100"
              size="sm"
              color="white"
              _hover={{ bg: 'blue.100' }}
              borderRadius="xl"
            >
              Status
            </Button>
          </Flex>
        </Box>
        <Box bg="blue.100" mt="1rem" py="1.5rem" h="100vh" borderTopRadius="32px" color="white">
          {isLoading ? (
            <Box textAlign="center" py="2rem">
              <Spinner color="primary" size="xl" />
            </Box>
          ) : (
            <Box px="1rem">
              {data?.length ? (
                <Box>
                  {data?.map((item) => {
                    const amount = item.amount;
                    const privateKey = new NodeRSA(secretKey);
                    const decryptedData = privateKey.decrypt(amount, 'utf8');

                    return (
                      <ItemListDisplay
                        label={`Qux User ${startCase(item.type)}`}
                        date={item.created_at}
                        amount={+decryptedData}
                        key={item.id}
                        complete={item.confirmed}
                        image={QuxWalletIcon}
                        hasComplete
                      />
                    );
                  })}
                </Box>
              ) : (
                <>No Record</>
              )}
            </Box>
          )}
        </Box>
      </>
    </HeaderContainer>
  );
};

export default TransactionHistoryPage;
