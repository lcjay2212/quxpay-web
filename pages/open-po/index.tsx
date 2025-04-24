import { Box, Flex, Grid, Spinner } from '@chakra-ui/react';
import { HeaderContainer, ItemListDisplay } from 'component';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { usePosHistory, useUser } from 'store';
import { getServerSideProps } from 'utils';

const OpenPosHistoryPage: FC = () => {
  const { received, created, isLoading } = usePosHistory();
  const { user } = useUser();
  const router = useRouter();
  const [filter, setFilter] = useState('RECEIVED');

  return (
    <HeaderContainer label={!user?.corporate ? 'Unpaid POs' : 'Open POs'} route="/dashboard">
      <Box my="1rem" px="1rem">
        {isLoading ? (
          <Box textAlign="center" py="2rem">
            <Spinner color="primary" size="xl" />
          </Box>
        ) : (
          <>
            <Flex width="100%" maxW="184px" justifyContent="center" margin="auto">
              {['RECEIVED', 'CREATED'].map((q) => (
                <Grid
                  key={q}
                  role="button"
                  placeContent="center"
                  flex="1"
                  h="34px"
                  onClick={(): void => setFilter(q)}
                  bg={filter === q ? 'white' : 'black'}
                  color={filter === q ? 'black' : 'white'}
                  cursor="pointer"
                  transition="all 0.25s ease-in"
                  border="1px solid white"
                  px="2.75rem"
                  mb="1.5rem"
                >
                  {startCase(q.toLowerCase())}
                </Grid>
              ))}
            </Flex>
            <Box color="white">
              {(filter === 'RECEIVED' ? received : created).length ? (
                (filter === 'RECEIVED' ? received : created).map((item) => (
                  <ItemListDisplay
                    label={item.label}
                    date={item.created}
                    amount={+item.amount}
                    key={item.id}
                    complete={item.confirmed}
                    image="/assets/icons/unpaid-history-icon.webp"
                    type={item.type}
                    onClick={(): void => void router.push(`/open-po/${item.id}`)}
                  />
                ))
              ) : (
                <>No Record</>
              )}
            </Box>
          </>
        )}
      </Box>
    </HeaderContainer>
  );
};

export { getServerSideProps };

export default OpenPosHistoryPage;
