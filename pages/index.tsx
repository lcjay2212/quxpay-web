import { Box, BoxProps, Button, Container, Flex, Grid, Heading, Text, useBreakpoint } from '@chakra-ui/react';
import { Footer, SEO, TopBarHeader } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useHomePageModal } from 'store';

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
        <Box
          w={{ base: 'auto', md: 400, lg: 560 }}
          color="white"
          textAlign={{ base: 'center', md: 'start' }}
          {...props}
        >
          <Heading fontSize={{ base: '2.5rem', md: '60px' }} fontWeight="extrabold" fontFamily="Coda, sans-serif">
            {label}
          </Heading>
          <Text fontSize={{ base: '1.25rem', lg: '30px' }} my="1.5rem" fontFamily="'Verdana', sans-serif">
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
  const breakPoint = useBreakpoint();

  return (
    <Box bg="#3D075F">
      <SEO page="index" />
      <Grid filter={visible ? 'blur(8px)' : ''} position="relative">
        <Box display={{ base: 'none', md: 'block' }}>
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/bg-video.mp4" type="video/mp4" />
          </video>
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/bg-video-mobile.mp4" type="video/mp4" />
          </video>
        </Box>
        <Container maxW="1080px" position="absolute" mx="auto" left={0} right={0}>
          <Box>
            <TopBarHeader />
            <Box
              pb={{ base: '4rem', md: '5rem' }}
              display="flex"
              flexDir={{ base: 'column', md: 'row', lg: 'row', xl: 'column' }}
              alignItems="center"
              justifyContent="center"
            >
              <Flex placeContent="center">
                <Image
                  src="/assets/images/phone.webp"
                  height={breakPoint === 'md' ? 200 : breakPoint === 'xl' ? 300 : 100}
                  width={breakPoint === 'md' ? 400 : breakPoint === '2xl' ? 600 : 400}
                  alt="Phone Image"
                  placeholder="empty"
                  style={{ objectFit: 'contain' }}
                  priority={false}
                />
              </Flex>
              <Box>
                <Text
                  fontSize="37px"
                  textAlign="center"
                  color="white"
                  fontFamily="'Coda', sans-serif"
                  fontWeight="extrabold"
                >
                  The Pay App™
                </Text>
                <Text
                  fontSize="27px"
                  textAlign="center"
                  color="white"
                  fontFamily="'Coda', sans-serif"
                  fontWeight="extrabold"
                >
                  Pay Like It's <br /> Nobody's Business.
                  <br /> Because It Isn't.
                </Text>

                <Flex
                  justify="center"
                  alignItems="center"
                  borderRadius="xl"
                  border="3px solid #D222A8"
                  bg="white"
                  gap={3}
                  p="1rem"
                >
                  <Image src="/assets/images/qr1.png" height={100} width={100} alt="QR" />
                  <Flex flexDirection="column" gap={4}>
                    <Box
                      cursor="pointer"
                      onClick={(): void =>
                        void window.open(
                          'https://play.google.com/store/apps/details?id=com.qux.quxpay.android&hl=en-US',
                          'noopener,noreferrer'
                        )
                      }
                    >
                      <Image src="/assets/images/google-play.png" height={150} width={150} alt="QR" />
                    </Box>

                    <Box
                      cursor="pointer"
                      onClick={(): void =>
                        void window.open('https://apps.apple.com/us/app/quxpay/id6499033621', 'noopener,noreferrer')
                      }
                    >
                      <Image src="/assets/images/app-store.png" height={150} width={150} alt="QR" />
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Container>
      </Grid>

      <Box
        h="130vh"
        bgImage={{
          base: "url('/assets/images/military-grade-security-4.webp')",
          md: "url('/assets/images/military-grade-security.webp')",
        }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Content
          label="Military-Grade Security"
          content="QUX Pay® utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private."
          onClick={(): void => void router.push('/military-grade-security')}
        />
      </Box>

      <Box
        h="100vh"
        bgImage={{ base: '', md: "url('/assets/images/no-middleman.webp')" }}
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
      >
        <Content
          label="NO MIDDLEMAN. NO NONSENSE."
          content="Unlike others, QUX Pay® has no hidden fees and will never sell your data for profit. What you see is what
          you get."
          alignItems="start"
          onClick={(): void => void router.push('/no-middleman')}
        />
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="flex-end">
          <Image src="/assets/images/no-middleman.webp" alt="img" width={1000} height={1000} placeholder="empty" />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/payments-made-perfect.webp')" }}
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
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="center">
          <Image
            src="/assets/images/payments-made-perfect-4.webp"
            alt="img"
            width={1000}
            height={1000}
            placeholder="empty"
          />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/transfers.webp')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        py={{ base: '4rem', md: '12rem' }}
      >
        <Content
          label=" Transfers in a Flash"
          content="Amount transferred through QUX Pay® reaches its destination almost instantly. As quick as sending a text. No more waiting around like crypto."
          onClick={(): void => void router.push('/transfers')}
        />
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="center">
          <Image src="/assets/images/transfers.webp" alt="img" width={1000} height={1000} placeholder="empty" />
        </Box>
      </Box>

      <Container maxW="1080px" color="white" textAlign="center" mt={{ base: '0', md: '15rem' }} mb="5rem">
        <Text fontSize={{ base: '2rem', md: '4rem' }} fontWeight="extrabold">
          The Future of Payments.
          <br /> Today.
        </Text>
        <Text fontSize={{ base: '1.25rem', md: '30px' }} mt="2rem">
          QUX Pay® combines must-have transfer features with next-gen tech insights.
          <br /> Monitor where your payments go.
        </Text>
      </Container>

      <Flex
        justify="center"
        alignItems="center"
        gap={3}
        bg="white"
        borderRadius="3xl"
        px="2rem"
        py="2rem"
        border={{ base: '3px solid #D222A8' }}
        maxW={500}
        mx="auto"
      >
        <Image
          src="/assets/images/qr1.png"
          height={breakPoint === 'base' ? 140 : 200}
          width={breakPoint === 'base' ? 140 : 200}
          alt="QR"
        />
        <Flex flexDirection="column" gap={4}>
          <Box
            cursor="pointer"
            onClick={(): void =>
              void window.open(
                'https://play.google.com/store/apps/details?id=com.qux.quxpay.android&hl=en-US',
                'noopener,noreferrer'
              )
            }
          >
            <Image src="/assets/images/google-play.png" height={200} width={200} alt="QR" />
          </Box>

          <Box
            cursor="pointer"
            onClick={(): void =>
              void window.open('https://apps.apple.com/us/app/quxpay/id6499033621', 'noopener,noreferrer')
            }
          >
            <Image src="/assets/images/app-store.png" height={200} width={200} alt="QR" />
          </Box>
        </Flex>
      </Flex>

      <Box
        h="50vh"
        bgImage="url('/assets/images/box.jpg')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={{ base: 'cover', md: 'contain' }}
      ></Box>

      <Footer />
    </Box>
  );
};

export default Home;
