import { Box, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, ItemListDisplay } from 'component';
import { FETCH_CRYPTO_TRANSACTION_HISTORY } from 'constants/api';
import { startCase } from 'lodash';
import { CryptoIcon } from 'public/assets';
import { FC } from 'react';
import { getServerSideProps } from 'utils';

const CryptoHistory: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['crytpoTransactionHistory'],
    queryFn: FETCH_CRYPTO_TRANSACTION_HISTORY,
  });

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
              data?.map((item, index) => (
                <ItemListDisplay
                  label={`${item.currency} ${item.pos_id} `}
                  date={item.created}
                  amount={+item.amount}
                  key={index}
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
