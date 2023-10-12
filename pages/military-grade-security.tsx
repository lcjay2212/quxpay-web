import { Box, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Footer from 'component/Footer';
import TopBarHeader from 'component/TopBarHeader';
import Head from 'next/head';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'Backed by Bank-Level Protocols',
    context: `Multilayered security protections follow the strictest 
    protocols used by financial institutions worldwide. 
    Fort Knox level.`,
    imageSrc: '/assets/images/Bank Level Protocols.png',
    reverse: false,
  },
  {
    title: 'Patent-Pending Encryption Mesh',
    context: `QuxPay utilizes a global encryption mesh 
    infrastructure allowing each device to pay 
    in real-time. Big words but the point is - 
    there's no central point of failure. Hacks 
    and data breaches can't happen.`,
    imageSrc: '/assets/images/1092 [Converted].png',
    reverse: true,
  },
  {
    title: 'Anonymous Transactions',
    context: `Every payment is anonymized using industry
    leading tools. Your identity stays hidden, even
    from us. Totally private.`,
    imageSrc: '/assets/images/Anonymous 2.png',
    reverse: true,
  },
];

const MilitaryGradeSecurityPage: FC = () => {
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
        h="120vh"
        bgImage="url('/assets/images/BG-2.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Content
            label="Military-Grade Security"
            content="QuxPay utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private."
            showBtn={false}
          />
        </Container>
      </Grid>

      <Text fontSize="3rem" textAlign="center" textTransform="uppercase" color="white">
        Hacker-proof. Unbreakable.
        <br /> Impenetrable.
      </Text>

      <Container maxW="1080px">
        {STATIC_DATA.map((item, index) => (
          <Flex
            justifyContent="center"
            alignItems="center"
            key={index}
            flexDir={!item.reverse ? 'row' : 'row-reverse'}
            gap={12}
            my="5rem"
          >
            <Box w={470} color="white">
              <Heading fontSize="48px" fontWeight="normal">
                {item.title}
              </Heading>
              <Text fontSize="30px" my="1.5rem">
                {item.context}
              </Text>
            </Box>

            <Image src={item.imageSrc} width={500} height={500} alt="test" style={{ objectFit: 'contain' }} />
          </Flex>
        ))}
      </Container>

      <Box
        h="100vh"
        bgImage="url('/assets/images/BG-5.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        my="15rem"
      />
      <Footer />
    </Box>
  );
};

export default MilitaryGradeSecurityPage;
