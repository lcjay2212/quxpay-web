import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Grid, Heading, IconButton, Text } from '@chakra-ui/react';
import Footer from 'component/Footer';
import HomeModal from 'component/Modal/HomeModal';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PhoneImage, QuxPayLogoPng } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const Home: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = useHomePageModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Box bg="#3D075F">
      <Head>
        <title>Quxpay</title>
        <meta name="description" content="Quxpay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid
        h="100vh"
        bgImage="url('/assets/images/BG.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <Flex justifyContent="space-between" alignItems="center">
            <Box display="flex" justifyContent="center">
              <Image src={QuxPayLogoPng} height={100} width={150} alt="Qux Logo" />
            </Box>

            <Flex gap={4} alignItems="center">
              <Button
                variant="primary"
                borderRadius="3xl"
                w={150}
                h={50}
                onClick={(): void => void router.push('/login')}
              >
                Log In
              </Button>
              <Button
                variant="secondary"
                borderRadius="3xl"
                w={150}
                h={50}
                onClick={(): void => void router.push('/register')}
              >
                Register
              </Button>
              <IconButton
                bg="transparent"
                _active={{ bg: 'transparent' }}
                _hover={{ bg: 'transparent' }}
                aria-label="hamburger"
                icon={<HamburgerIcon color="purple" h={35} w={35} />}
                onClick={(): void => setVisible(!visible)}
              />
            </Flex>
          </Flex>

          <Flex placeContent="center">
            <Image src={PhoneImage} height={300} width={700} alt="Phone Image" />
          </Flex>
          <Text fontSize="37px" textTransform="uppercase" textAlign="center" color="white">
            Pay Like It's <br /> Nobody's Business.
            <br /> Because It Isn't.
          </Text>
        </Container>

        <HomeModal />
      </Grid>

      <Box
        h="130vh"
        bgImage="url('/assets/images/BG-2.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Container maxW="1080px">
          <Flex h="100vh" alignItems="center">
            <Box w={400} color="white">
              <Heading fontSize="60px" fontWeight="normal">
                Military-Grade <br /> Security
              </Heading>
              <Text fontSize="30px" my="1.5rem">
                QuxPay utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box bg="#3D075F" pb="10rem">
        <Container maxW="1080px">
          <Flex alignItems="center">
            <Box color="white">
              <Heading fontSize="60px" fontWeight="normal">
                NO MIDDLEMAN.
                <br />
                NO NONSENSE.
              </Heading>
              <Text fontSize="30px" my="1.5rem" w={400}>
                Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what
                you get.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        bgImage="url('/assets/images/BG-3.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        pb="10rem"
      >
        <Container maxW="1080px">
          <Flex h="60vh" alignItems="center">
            <Box color="white">
              <Heading fontSize="60px" fontWeight="normal">
                P2P Payments <br />
                Made Perfect
              </Heading>
              <Text fontSize="30px" w={400} my="1.5rem">
                Pay friends, family, contacts instantly. No fees, no limits. Spend on the move.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        bgImage="url('/assets/images/BG-4.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        py="12rem"
      >
        <Container maxW="1080px">
          <Flex h="100vh" alignItems="center">
            <Box w={400} color="white">
              <Heading fontSize="60px" fontWeight="normal">
                Transfers in <br /> a Flash
              </Heading>
              <Text fontSize="30px" my="1.5rem">
                Amount transferred through QuxPay reaches its destination almost instantly. As quick as sending a text.
                No more waiting around like crypto.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Container maxW="1080px" color="white" textAlign="center" mt="15rem" mb="5rem">
        <Text fontSize="4rem">
          The Future of Payments.
          <br /> Today.
        </Text>
        <Text fontSize="30px" mt="2rem">
          QuxPay combines must-have transfer features with next-gen tech insights.
          <br /> Monitor where your payments go.
        </Text>
      </Container>
      <Box
        h="150vh"
        bgImage="url('/assets/images/BG-5.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      />

      <Footer />
    </Box>
  );
};

export default Home;
