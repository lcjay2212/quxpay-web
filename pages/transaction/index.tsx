/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, ItemListDisplay, TextField, TransactionHistoryFilterModal } from 'component';
import { isLocalHost } from 'constants/url';
import { startCase } from 'lodash';
import { DATE_FILTER, STATUS_FILTER, TRANSACTION_FILTER } from 'mocks/transactionFilter';
import forge from 'node-forge';
import { QuxWalletIcon } from 'public/assets';
import { FC, useState } from 'react';
import { BsBank2 } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { usePage, useTransactionHistoryFilterModal } from 'store';
import { notify, queryClient } from 'utils';
const TransactionHistoryPage: FC = () => {
  const [search, setSearch] = useState('');
  const {
    setVisible,
    visible,
    setDateFilter,
    // dateFilter,
    // transactionFilter,
    setTransactionFilter,
    // statusFilter,
    setStatusFilter,
  } = useTransactionHistoryFilterModal((state) => state);

  const [page, setPage] = usePage((e) => [e.page, e.setPage]);

  const transactionsData = queryClient.getQueryData<{ transactions: any[] }>(['transactionsSecurityFile']);
  const userPrivateKey = queryClient.getQueryData<{ data: string }>(['userPrivateKey']);

  const { data: decryptedTransactions, isLoading: decryptedTransactionsLoading } = useQuery({
    queryKey: ['decryptedTransactions', page],
    queryFn: () => {
      const transactions = JSON.parse(transactionsData?.transactions[page]);
      const privateKey = forge.pki.privateKeyFromPem(userPrivateKey?.data);
      const decryptedContents: string[] = [];

      transactions?.forEach((content: string) => {
        try {
          const message = forge.util.decode64(content);
          const decryptedContent = privateKey.decrypt(message, 'RSA-OAEP');
          decryptedContents.push(JSON.parse(decryptedContent));
        } catch (error) {
          notify('Decryption failed for content:', { status: 'error' });
        }
      });

      return decryptedContents;
    },
  });

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
        <Box bg="blue.100" mt="1rem" py="1.5rem" minH="80vh" h="auto" borderTopRadius="32px" color="white">
          {decryptedTransactionsLoading ? (
            <Box textAlign="center" py="2rem">
              <Spinner color="primary" size="xl" />
            </Box>
          ) : (
            <Box px="1rem">
              {decryptedTransactions?.length ? (
                <Box>
                  {decryptedTransactions.map((item: any) => (
                    <ItemListDisplay
                      label={`Qux User ${startCase(item.type)}`}
                      date={item.created_at}
                      amount={+item.amount}
                      key={item.id}
                      complete={item.confirmed}
                      image={QuxWalletIcon}
                      hasComplete
                    />
                  ))}
                </Box>
              ) : (
                <>No Record</>
              )}
            </Box>
          )}

          <Flex justifyContent="center">
            <Button color="black" onClick={(): void => setPage(page + 1)} isLoading={decryptedTransactionsLoading}>
              Load More
            </Button>
          </Flex>
        </Box>

        {id === 'date' && <TransactionHistoryFilterModal title="Date" data={DATE_FILTER} setValue={setDateFilter} />}
        {id === 'transaction' && (
          <TransactionHistoryFilterModal
            title="Transaction"
            data={TRANSACTION_FILTER}
            setValue={setTransactionFilter}
          />
        )}
        {id === 'status' && (
          <TransactionHistoryFilterModal title="Status" data={STATUS_FILTER} setValue={setStatusFilter} />
        )}
      </>
    </HeaderContainer>
  );
};

export default TransactionHistoryPage;
