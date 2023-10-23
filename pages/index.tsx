import { Box, BoxProps, Button, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Footer from 'component/Footer';
import TopBarHeader from 'component/TopBarHeader';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PhoneImage } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

export const Content: FC<
  BoxProps & {
    label: string;
    content: string;
    alignItems?: string;
    showBtn?: boolean;
    onClick?: () => void;
  }
> = ({ label, content, alignItems = 'center', showBtn = true, onClick, ...props }) => {
  return (
    <Container maxW="1080px">
      <Flex
        h={{ base: 'auto', md: '100vh' }}
        justifyContent={{ base: 'center', md: 'flex-start' }}
        alignItems={alignItems}
        pt={{ base: '5rem', md: 0 }}
        pb={{ base: '1rem', md: 0 }}
      >
        <Box w={{ base: 'auto', md: 470 }} color="white" textAlign={{ base: 'center', md: 'start' }} {...props}>
          <Heading fontSize={{ base: '2.5rem', md: '60px' }} fontWeight="normal" fontFamily="'Coda', sans-serif">
            {label}
          </Heading>
          <Text fontSize={{ base: '1.25rem', md: '30px' }} my="1.5rem">
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
      <Grid filter={visible ? 'blur(8px)' : ''} position="relative">
        <Box display={{ base: 'none', md: 'block' }}>
          <video height="auto" width="100%" loop autoPlay id="backgroud-video">
            <source src="./assets/video/bg-video.mp4" type="video/mp4" />
            <track default kind="captions" srcLang="en" src="" />
          </video>
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <video height="auto" width="100%" loop autoPlay id="backgroud-video">
            <source src="./assets/video/bg-video-mobile.mp4" type="video/mp4" />
            <track default kind="captions" srcLang="en" src="" />
          </video>
        </Box>
        <Container maxW="1080px" position="absolute" mx="auto" left={0} right={0}>
          <Box>
            <TopBarHeader />
            <Box pb={{ base: '4rem', md: '5rem' }}>
              <Flex placeContent="center">
                <Image
                  src={PhoneImage}
                  height={300}
                  width={600}
                  alt="Phone Image"
                  placeholder="blur"
                  style={{ objectFit: 'contain' }}
                />
              </Flex>
              <Text
                fontSize={{ base: '2rem', md: '37px' }}
                textAlign="center"
                color="white"
                fontFamily="'Coda', sans-serif"
              >
                Pay Like It's <br /> Nobody's Business.
                <br /> Because It Isn't.
              </Text>

              <Flex justifyContent="center">
                <Flex
                  mt="1.5rem"
                  justifyContent="center"
                  bg="white"
                  borderRadius="2xl"
                  border="2px solid #D11CB6"
                  width={350}
                  p="0.5rem"
                >
                  <Image
                    src="/assets/images/qrcode.png"
                    height={100}
                    width={100}
                    alt="Phone Image"
                    style={{ objectFit: 'contain' }}
                    placeholder="blur"
                    blurDataURL={'data:image/jpeg...'}
                  />
                  <Text textAlign="center" color="black" fontWeight="bold" fontSize="2rem" letterSpacing="tighter">
                    DOWNLOAD <br /> QUX PAY
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Container>
      </Grid>

      <Box
        h="130vh"
        bgImage={{
          base: "url('/assets/images/military-grade-security-4.png')",
          md: "url('/assets/images/military-grade-security.png')",
        }}
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
        bgImage={{ base: '', md: "url('/assets/images/no-middleman.png')" }}
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
      >
        <Content
          label="NO MIDDLEMAN. NO NONSENSE."
          content="Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what
          you get."
          alignItems="start"
          onClick={(): void => void router.push('/no-middleman')}
        />
        <Box display={{ base: 'block', md: 'none' }}>
          <Image src="/assets/images/no-middleman.png" alt="img" width={400} height={300} />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/payments-made-perfect.png')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        pb={{ base: '', md: '10rem' }}
      >
        <Content
          label="P2P Payments Made Perfect"
          content="Pay friends, family, contacts instantly. No fees, no limits. Spend on the move."
          onClick={(): void => void router.push('/payments-made-perfect')}
        />
        <Box display={{ base: 'block', md: 'none' }}>
          <Image src="/assets/images/payments-made-perfect-4.png" alt="img" width={400} height={300} />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/transfers.png')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        py={{ base: '4rem', md: '12rem' }}
      >
        <Content
          label=" Transfers in a Flash"
          content="Amount transferred through QuxPay reaches its destination almost instantly. As quick as sending a text. No more waiting around like crypto."
          onClick={(): void => void router.push('/transfers')}
        />
        <Box display={{ base: 'block', md: 'none' }}>
          <Image src="/assets/images/transfers.png" alt="img" width={400} height={300} />
        </Box>
      </Box>

      <Container maxW="1080px" color="white" textAlign="center" mt={{ base: '0', md: '15rem' }} mb="5rem">
        <Text fontSize={{ base: '2rem', md: '4rem' }}>
          The Future of Payments.
          <br /> Today.
        </Text>
        <Text fontSize={{ base: '1.25rem', md: '30px' }} mt="2rem">
          QuxPay combines must-have transfer features with next-gen tech insights.
          <br /> Monitor where your payments go.
        </Text>
      </Container>

      <Box
        h={{ base: '300px', md: '100vh' }}
        bgImage="url('/assets/images/BG-5.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        my={{ base: '3rem', md: 0 }}
      />

      <Footer />
    </Box>
  );
};

export default Home;
