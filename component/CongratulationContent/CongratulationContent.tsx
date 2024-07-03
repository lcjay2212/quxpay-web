/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, chakra, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CheckCircleIcon, CryptoIcon, QuxTokenIcon, WithdrawSuccessful } from 'public/assets';
import { FC } from 'react';
import { useCongratulationContent } from 'store/useCongratulationContent';

const CongratulationContent: FC<{ label: string }> = ({ label }) => {
  const type = useCongratulationContent((e) => e.type);
  const setVisible = useCongratulationContent((e) => e.setVisible);
  const amount = useCongratulationContent((e) => e.amount);
  const router = useRouter();
  return (
    <>
      {label === 'Purchase' && (
        <Grid position="relative" overflow="hidden" h="100vh">
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/success.mp4" type="video/mp4" />
          </video>
          <Container maxW="1080px" position="absolute" mx="auto" left={0} right={0}>
            <Box
              pb={{ base: '4rem', md: '5rem' }}
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box mt="14rem">
                <Image src={CheckCircleIcon} width={70} height={70} placeholder="empty" alt="Redeem" />
              </Box>
              <Heading as="h1" fontWeight="bold" fontSize="24px" color="primary" mt="3rem" mb="1rem">
                CONGRATUALATIONS
              </Heading>
              <Box color="white" textAlign="center">
                <Flex justifyContent="center" mb="1rem" alignItems="center">
                  <span>
                    <Image src={QuxTokenIcon} width={40} height={40} alt="Qux Token" />
                  </span>
                  <chakra.span fontSize="2rem" mt="0.3rem">
                    {amount?.toFixed(2)}
                  </chakra.span>
                </Flex>
                {type === 'BANK' && (
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
              </Box>

              <Button
                variant="primary"
                borderRadius="1rem"
                mt="16rem"
                w={350}
                h="3.25rem"
                onClick={(): void => {
                  void router.push('/dashboard');
                  setVisible(false);
                }}
              >
                Complete - Back to Home
              </Button>
            </Box>
          </Container>
        </Grid>
      )}

      {label === 'Redeem' && (
        <HeaderContainer label="Redeem" route="/dashboard">
          <Flex justifyContent="center" alignItems="center" flexDir="column" textAlign="center">
            <Box mt="14rem">
              <Image
                src={type === 'CRYPTO' || type === 'ADD_CRYPTO' ? CryptoIcon : WithdrawSuccessful}
                width={100}
                height={100}
                placeholder="empty"
                alt="Redeem"
              />
            </Box>
            <Text color="white" fontSize="2rem">
              $ {amount?.toFixed(2)}
            </Text>

            {(type === 'CRYPTO' || type === 'ADD_CRYPTO') && (
              <Text color="white" fontSize="20px">
                Redeeming Tokens <br /> to Crypto Wallet
                <br /> Successfully Initiated
              </Text>
            )}
            {type === 'BANK' && (
              <Text color="white" fontSize="20px">
                Redeeming Tokens <br /> to Bank Nickname
                <br /> Successfully Initiated
              </Text>
            )}
            <Button
              variant="primary"
              borderRadius="1rem"
              mt="16rem"
              w={350}
              h="3.25rem"
              onClick={(): void => void router.push('/dashboard')}
            >
              Complete - Back to Home
            </Button>
          </Flex>
        </HeaderContainer>
      )}
    </>
  );
};

export default CongratulationContent;
