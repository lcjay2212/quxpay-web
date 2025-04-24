import { Box, Spinner } from '@chakra-ui/react';
import { HeaderContainer, ItemListDisplay } from 'component';
import { startCase } from 'lodash';
import { FC } from 'react';
import { usePosHistory } from 'store';
const PluginPoHistoryPage: FC = () => {
  const { pluginData, isLoading } = usePosHistory();

  return (
    <HeaderContainer label="Plugin PO" route="/dashboard">
      <>
        <Box bg="blue.100" mt="1rem" py="1.5rem" minH="100vh" h="auto" borderTopRadius="32px" color="white">
          {isLoading ? (
            <Box textAlign="center" py="2rem">
              <Spinner color="primary" size="xl" />
            </Box>
          ) : (
            <Box px="1rem">
              {pluginData?.length ? (
                <Box>
                  {pluginData?.map((item) => {
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
                        image="/assets/icons/qux_wallet.webp"
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
      </>
    </HeaderContainer>
  );
};

export default PluginPoHistoryPage;
