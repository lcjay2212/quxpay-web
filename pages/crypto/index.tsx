import { Box, Spinner } from '@chakra-ui/react';
import { HeaderContainer, ItemListDisplay } from 'component';
import { FETCH_CRYPTO_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { CryptoIcon } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { errorHandler, getServerSideProps } from 'utils';

const CryptoHistory: FC = () => {
  const { data, isLoading } = useQuery('crytpoTransactionHistory', FETCH_CRYPTO_TRANSACTION_HISTORY, errorHandler);

  return (
    <HeaderContainer label="Crypto" route="/dashboard">
      <Box my="1rem" px="1rem">
        {isLoading ? (
          <Box textAlign="center" py="2rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <>
            {data?.length ? (
              data?.map((item) => (
                <ItemListDisplay
                  label={`${item.currency} ${item.pos_id} `}
                  date={item.created}
                  amount={+item.amount}
                  key={item.id}
                  image={CryptoIcon}
                  type={startCase(item.type)}
                />
              ))
            ) : (
              <>No Record</>
            )}
          </>
        )}
      </Box>
    </HeaderContainer>
  );
};

export { getServerSideProps };

export default CryptoHistory;
