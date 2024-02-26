import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { TextField } from 'component/TextField';
import TransactionHistoryFilterModal from 'component/TransactionHistoryFilterModal';
import { FETCH_TRANSACTION_HISTORY_PHASE_TWO } from 'constants/api';
import { startCase } from 'lodash';
import { DATE_FILTER, STATUS_FILTER, TRANSACTION_FILTER } from 'mocks/transactionFilter';
import NodeRSA from 'node-rsa';
import { QuxWalletIcon } from 'public/assets';
import { FC, useState } from 'react';
import { BsBank2 } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useTransactionHistoryFilterModal } from 'store/useTransactionHistoryFilterModal';
import { secretKey } from 'utils/secretKey';
const TransactionHistoryPage: FC = () => {
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

  const [id, setId] = useState('');
  return (
    <HeaderContainer label="Transaction" route="/dashboard">
      <>
        <Box mx="1rem" mt="1rem">
          <TextField isSearch type="email" value={''} placeholder="Search" />

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
