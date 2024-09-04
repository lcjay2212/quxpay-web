import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, ItemListDisplay, TextField, TransactionHistoryFilterModal } from 'component';
import { FETCH_TRANSACTION_HISTORY_PHASE_TWO } from 'constants/api';
import { isLocalHost } from 'constants/url';
import { startCase } from 'lodash';
import { DATE_FILTER, STATUS_FILTER, TRANSACTION_FILTER } from 'mocks/transactionFilter';
import { QuxWalletIcon } from 'public/assets';
import { FC, useState } from 'react';
import { BsBank2 } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
// import { usePrivatekey } from 'store';
import { useTransactionHistoryFilterModal } from 'store';
const TransactionHistoryPage: FC = () => {
  const [search, setSearch] = useState('');
  const {
    setVisible,
    visible,
    setDateFilter,
    dateFilter,
    transactionFilter,
    setTransactionFilter,
    statusFilter,
    setStatusFilter,
  } = useTransactionHistoryFilterModal((state) => state);
  const { data, isLoading } = useQuery({
    queryKey: ['transactionHistoryPhaseTwo', dateFilter, transactionFilter, statusFilter],
    queryFn: FETCH_TRANSACTION_HISTORY_PHASE_TWO,
  });
  // const privatekey = usePrivatekey((state) => state.privatekey);

  const [id, setId] = useState('');
  return (
    <HeaderContainer label="Transactions" route="/dashboard">
      <>
        {isLocalHost() && (
          <Box mx="1rem" mt="1rem">
            <TextField
              isSearch
              type="email"
              value={search}
              onChange={(e): void => setSearch(e.target.value)}
              placeholder="Search"
            />

            <Flex mt="1rem" gap={3} justifyContent="center">
              <Button
                leftIcon={<CalendarIcon />}
                bg="blue.100"
                size="sm"
                color="white"
                _hover={{ bg: 'blue.100' }}
                borderRadius="xl"
                onClick={(): void => {
                  setId('date');
                  setVisible(!visible);
                }}
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
                onClick={(): void => {
                  setId('transaction');
                  setVisible(!visible);
                }}
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
                onClick={(): void => {
                  setId('status');
                  setVisible(!visible);
                }}
              >
                Status
              </Button>
            </Flex>
          </Box>
        )}
        <Box bg="blue.100" mt="1rem" py="1.5rem" minH="100vh" h="auto" borderTopRadius="32px" color="white">
          {isLoading ? (
            <Box textAlign="center" py="2rem">
              <Spinner color="primary" size="xl" />
            </Box>
          ) : (
            <Box px="1rem">
              {data?.length ? (
                <Box>
                  {data?.map((item) => {
                    // const amount = item.amount;
                    // const privateKey = new NodeRSA(privatekey);
                    // const decryptedData = privateKey.decrypt(amount, 'utf8');

                    return (
                      <ItemListDisplay
                        label={`Qux User ${startCase(item.type)}`}
                        date={item.created_at}
                        amount={+item.amount}
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
        {id === 'date' && (
          <TransactionHistoryFilterModal title="Date" data={DATE_FILTER} setValue={setDateFilter} value={dateFilter} />
        )}
        {id === 'transaction' && (
          <TransactionHistoryFilterModal
            title="Transaction"
            data={TRANSACTION_FILTER}
            setValue={setTransactionFilter}
            value={transactionFilter}
          />
        )}
        {id === 'status' && (
          <TransactionHistoryFilterModal
            title="Status"
            data={STATUS_FILTER}
            setValue={setStatusFilter}
            value={statusFilter}
          />
        )}
      </>
    </HeaderContainer>
  );
};

export default TransactionHistoryPage;
