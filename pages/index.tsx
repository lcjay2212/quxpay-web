import { Box, Button, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Footer from 'component/Footer';
import TopBarHeader from 'component/TopBarHeader';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PhoneImage } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

export const Content: FC<{
  label: string;
  content: string;
  alignItems?: string;
  showBtn?: boolean;
  onClick?: () => void;
}> = ({ label, content, alignItems = 'center', showBtn = true, onClick }) => {
  return (
    <Container maxW="1080px">
      <Flex h="100vh" alignItems={alignItems}>
        <Box w={470} color="white">
          <Heading fontSize="60px" fontWeight="normal">
            {label}
          </Heading>
          <Text fontSize="30px" my="1.5rem">
            {content}
          </Text>
          {showBtn && (
            <Button variant="seeMore" onClick={onClick}>
              See more
            </Button>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

const Home: FC = () => {
  const router = useRouter();
  const visible = useHomePageModal(({ visible }) => visible);
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
          <TopBarHeader />
          <Flex placeContent="center">
            <Image src={PhoneImage} height={300} width={700} alt="Phone Image" />
          </Flex>
          <Text fontSize="37px" textTransform="uppercase" textAlign="center" color="white">
            Pay Like It's <br /> Nobody's Business.
            <br /> Because It Isn't.
          </Text>
        </Container>
      </Grid>

      <Box
        h="130vh"
        bgImage="url('/assets/images/BG-2.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Content
          label="Military-Grade Security"
          content="QuxPay utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private."
          onClick={(): void => void router.push('/military-grade-security')}
        />
      </Box>

      <Box
        h="100vh"
        bgImage="url('/assets/images/BG-6.png')"
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
      >
        <Content
          label="NO MIDDLEMAN. NO NONSENSE."
          content="Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what
          you get."
          alignItems="start"
        />
      </Box>

      <Box
        bgImage="url('/assets/images/BG-3.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        pb="10rem"
      >
        <Content
          label="P2P Payments Made Perfect"
          content="Pay friends, family, contacts instantly. No fees, no limits. Spend on the move."
        />
      </Box>

      <Box
        bgImage="url('/assets/images/BG-4.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        py="12rem"
      >
        <Content
          label=" Transfers in a Flash"
          content="Amount transferred through QuxPay reaches its destination almost instantly. As quick as sending a text.
        No more waiting around like crypto."
        />
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
        h="100vh"
        bgImage="url('/assets/images/BG-5.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
      />

      <Footer />
    </Box>
  );
};

export default Home;
