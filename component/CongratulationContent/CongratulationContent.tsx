/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, chakra, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { HeaderContainer } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useCongratulationContent, useSelectedBankDetails, useTransactionHistoryModal } from 'store';

export const CongratulationContent: FC<{ label: string }> = ({ label }) => {
  const type = useCongratulationContent((e) => e.type);
  const setVisible = useCongratulationContent((e) => e.setVisible);
  const transactionModalVisible = useTransactionHistoryModal((e) => e.setVisible);
  const amount = useCongratulationContent((e) => e.amount);
  const router = useRouter();
  const [selectedBankDetails, setSelectedBankDetails] = useSelectedBankDetails((e) => [
    e.selectedBankDetails,
    e.setSelectedBankDetails,
  ]);

  return (
    <>
      {label === 'Purchase' && (
        <Grid position="relative" overflow="hidden" h="100vh">
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/success.mp4" type="video/mp4" />
          </video>
          <Container maxW="1080px" position="absolute" mx="auto" left={0} right={0} my="3rem">
            <Box display="flex" flexDir="column" justifyContent="space-between">
              <Flex flexDir="column" alignItems="center">
                <Box>
                  <Image
                    src="/assets/icons/check-circle.webp"
                    width={70}
                    height={70}
                    placeholder="empty"
                    alt="Redeem"
                  />
                </Box>
                <Heading as="h1" fontWeight="bold" fontSize="24px" color="primary" mt="3rem" mb="1rem">
                  CONGRATULATIONS
                </Heading>
                <Box color="white" textAlign="center">
                  <Flex justifyContent="center" mb="1rem" alignItems="center">
                    <span>
                      <Image src="/assets/icons/qux-token.webp" width={40} height={40} alt="Qux Token" />
                    </span>
                    <chakra.span fontSize="2rem" mt="0.3rem">
                      {amount?.toFixed(2)}
                    </chakra.span>
                  </Flex>
                  {(type === 'BANK' || type === undefined) && (
                    <>
                      <Text mb="1rem">
                        Your transaction has been <br />
                        Initiated successfully
                      </Text>

                      <Text>
                        Please remember that
                        <br />
                        bank transactions take
                        <br />
                        up to 3 days to process.
                      </Text>
                    </>
                  )}
                  {type === 'CRYPTO' && (
                    <Text>
                      Your transaction has been <br />
                      Completed successfully
                    </Text>
                  )}

                  {type === 'CREDIT' ||
                    (type === 'EXISTING_CREDITCARD' && (
                      <>
                        <Text>
                          Your transaction has been <br />
                          Completed successfully
                        </Text>
                        {/* <Text my="2rem">
                          Please remember that
                          <br />
                          credit card transactions
                          <br />
                          are instant but sometimes
                          <br />
                          have product limitations.
                        </Text>
                        <Text>
                          This card's limitations are:
                          <br />
                          No cannabis
                          <br />
                          No weapons
                          <br />
                          No adult content
                        </Text> */}
                      </>
                    ))}
                </Box>
              </Flex>

              <Flex flex="end" alignItems="center" justifyContent="center" mt="2rem">
                <Button
                  variant="primary"
                  borderRadius="1rem"
                  w={350}
                  h="3.25rem"
                  onClick={(): void => {
                    void router.push('/dashboard');
                    setVisible(false);
                    transactionModalVisible(true);
                  }}
                >
                  Complete - Back to Home
                </Button>
              </Flex>
            </Box>
          </Container>
        </Grid>
      )}

      {label === 'Redeem' && (
        <HeaderContainer label="Redeem" route="/dashboard">
          <Flex justifyContent="center" alignItems="center" flexDir="column" textAlign="center">
            <Box mt="14rem">
              <Image
                src={
                  type === 'CRYPTO' || type === 'ADD_CRYPTO'
                    ? '/assets/icons/crypto-icon.webp'
                    : '/assets/icons/withdraw_successful.webp'
                }
                width={100}
                height={100}
                placeholder="empty"
                alt="Redeem"
              />
            </Box>

            {(type === 'CRYPTO' || type === 'ADD_CRYPTO') && (
              <Text color="white" fontSize="20px">
                Redeeming QUX eToken® <br /> to Crypto Wallet
                <br /> Successfully Initiated
              </Text>
            )}
            {(type === 'BANK' || type === 'ADD_BANK') && (
              <Text color="white" fontSize="20px" mt="1rem">
                Redeeming QUX eToken® <br /> to {selectedBankDetails?.payment?.bankAccount.nameOnAccount}
                <br /> Successfully Initiated
              </Text>
            )}
            <Button
              variant="primary"
              borderRadius="1rem"
              mt="16rem"
              w={350}
              h="3.25rem"
              onClick={(): void => {
                void router.push('/dashboard');
                setSelectedBankDetails(null);
                setVisible(false);
                transactionModalVisible(true);
              }}
            >
              Complete - Back to Home
            </Button>
          </Flex>
        </HeaderContainer>
      )}
    </>
  );
};
