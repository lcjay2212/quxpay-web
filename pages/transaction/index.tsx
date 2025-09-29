/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HeaderContainer, ItemListDisplay } from 'component';
import Pagination from 'component/Pagination/Pagination';
import { startCase } from 'lodash';
import forge from 'node-forge';
import { FC } from 'react';
import { usePage } from 'store';
import { dayjsUtils, notify, queryClient } from 'utils';
const TransactionHistoryPage: FC = () => {
  // const [id, setId] = useState('');
  // const [search, setSearch] = useState('');
  // const {
  //   setVisible,
  //   visible,
  //   setDateFilter,
  //   // dateFilter,
  //   // transactionFilter,
  //   setTransactionFilter,
  //   // statusFilter,
  //   setStatusFilter,
  // } = useTransactionHistoryFilterModal((state) => state);

  const [page, setPage] = usePage((e) => [e.page, e.setPage]);

  const transactionsData = queryClient.getQueryData<{ transactions: any[] }>(['transactionsSecurityFile']);
  const userPrivateKey = queryClient.getQueryData<{ data: string }>(['userPrivateKey']);
  const passphrase = queryClient.getQueryData<{ pass: string }>(['passphrase']);

  const {
    data: decryptedTransactions,
    isLoading: decryptedTransactionsLoading,
    isPending,
  } = useQuery({
    queryKey: ['decryptedTransactions', page],
    queryFn: async () => {
      const transactions = transactionsData?.transactions[page];
      const { data } = await axios.get(transactions, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });

      const privateKey = forge.pki.decryptRsaPrivateKey(userPrivateKey?.data, passphrase?.pass);
      let combinedDecryptedContent = '';

      data?.forEach((content: string) => {
        try {
          const message = forge.util.decode64(content);
          const decryptedContent = privateKey.decrypt(message, 'RSA-OAEP');
          combinedDecryptedContent += decryptedContent;
        } catch (error) {
          notify('Decryption failed for content:', { status: 'error' });
        }
      });

      return JSON.parse(combinedDecryptedContent);
    },
  });

  return (
    <HeaderContainer label="Transactions" route="/dashboard">
      <>
        {/* {isLocalHost() && (
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
        )} */}
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          bg="blue.100"
          mt="1rem"
          py="1.5rem"
          minH="80vh"
          h="auto"
          borderTopRadius="32px"
          color="white"
        >
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
                      date={dayjsUtils.formatInUserTimezone(item.created_at)}
                      amount={+item.amount}
                      key={item.id}
                      complete={item.confirmed}
                      image="/assets/icons/qux_wallet.webp"
                      hasComplete
                    />
                  ))}
                </Box>
              ) : (
                <>No Record</>
              )}
            </Box>
          )}

          {transactionsData?.transactions.length && (
            <Pagination
              currentPage={page}
              totalPages={transactionsData.transactions.length}
              onPageChange={setPage}
              isLoading={isPending}
            />
          )}
        </Flex>

        {/* {id === 'date' && <TransactionHistoryFilterModal title="Date" data={DATE_FILTER} setValue={setDateFilter} />}
        {id === 'transaction' && (
          <TransactionHistoryFilterModal
            title="Transaction"
            data={TRANSACTION_FILTER}
            setValue={setTransactionFilter}
          />
        )}
        {id === 'status' && (
          <TransactionHistoryFilterModal title="Status" data={STATUS_FILTER} setValue={setStatusFilter} />
        )} */}
      </>
    </HeaderContainer>
  );
};

export default TransactionHistoryPage;
