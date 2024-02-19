import { Box, Spinner } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import ItemListDisplay from 'component/ItemListDisplay/ItemListDisplay';
import { FETCH_TRANSACTION_HISTORY_PHASE_TWO } from 'constants/api';
import { startCase } from 'lodash';
import NodeRSA from 'node-rsa';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { secretKey } from 'utils/secretKey';

const TransactionHistoryPage: FC = () => {
  const { data, isLoading } = useQuery('transactionHistoryPhaseTwo', FETCH_TRANSACTION_HISTORY_PHASE_TWO, errorHandler);
  return (
    <HeaderContainer label="Transaction" route="/dashboard">
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
    </HeaderContainer>
  );
};

export default TransactionHistoryPage;
