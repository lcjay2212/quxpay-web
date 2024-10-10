import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ItemListDisplay } from 'component';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import forge from 'node-forge';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { useDecryptedData } from 'store/useDecryptedData';
import { notify, queryClient } from 'utils';

export const TransactionHistory: FC = () => {
  const router = useRouter();

  const { data: transactionsData, dataLoading: transactionsLoading } = useDecryptedData('transactions');

  const { data: decryptedTransactions, isLoading: decryptedTransactionsLoading } = useQuery({
    queryKey: ['decryptedTransactions'],
    queryFn: async () => {
      const transactionUrls = transactionsData?.transactions;
      const userPrivateKey = queryClient.getQueryData<{ data: string }>(['userPrivateKey']);

      if (!transactionUrls) {
        return;
      }

      try {
        // Using axios.all for multiple requests
        const responses = await axios.all(transactionUrls.map((url: string) => axios.get(url)));

        // Process all the responses
        const transactions = responses.map((response: { data: string }) => {
          //decrypt using user private key
          const encryptedMessage = Buffer.from(response.data, 'base64');
          const privateKey = forge.pki.privateKeyFromPem(userPrivateKey?.data);
          const decryptedMessageBase64 = privateKey.decrypt(encryptedMessage, 'RSA-OAEP');
          return JSON.parse(decryptedMessageBase64); // return decrypted data
        });

        return transactions;
      } catch (error) {
        notify(`Error fetching transactions: ${error}`, { status: 'error' });
      }
    },
    enabled: !transactionsLoading,
  });

  return (
    <Box bg="blue.100" p="1rem" borderRadius="xl" my="1rem">
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1rem" fontWeight="bold">
          Transactions
        </Text>
        <Text
          fontSize="12px"
          cursor="pointer"
          as="u"
          color="primary"
          onClick={(): void => void router.push('/transaction')}
        >
          View All
        </Text>
      </Flex>

      {transactionsLoading || decryptedTransactionsLoading ? (
        <Box textAlign="center" py="2rem">
          <Spinner color="primary" size="xl" />
        </Box>
      ) : (
        <>
          {decryptedTransactions?.length ? (
            <Box>
              {decryptedTransactions.slice(0, 3).map((item) => {
                return (
                  <ItemListDisplay
                    label={`QUX® User ${startCase(item.type)}`}
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
        </>
      )}
    </Box>
  );
};
