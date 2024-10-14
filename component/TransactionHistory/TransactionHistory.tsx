/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ItemListDisplay } from 'component';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import forge from 'node-forge';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { usePage } from 'store';
import { useDecryptedData } from 'store/useDecryptedData';
import { notify, queryClient } from 'utils';

export const TransactionHistory: FC = () => {
  const router = useRouter();

  const { data: transactionsData, dataLoading: transactionsLoading } = useDecryptedData('transactions');
  const userPrivateKey = queryClient.getQueryData<{ data: string }>(['userPrivateKey']);
  const page = usePage((e) => e.page);

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
              {decryptedTransactions.slice(0, 3).map((item: any) => {
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
