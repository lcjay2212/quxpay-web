import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'Crystal Clear Fees',
    context: `The price you see is the price you pay. 
    No surprise charges popping up later.`,
    imageSrc: '/assets/images/no-middleman-1.png',
    reverse: true,
    alignItems: 'flex-end',
  },
  {
    title: 'User Data is Sacred',
    context: `We're not like your regular apps, we don't sell 
    or allow outside companies access to our systems 
    or user data for any reason. `,
    imageSrc: '/assets/images/no-middleman-2.png',
    reverse: true,
  },
  {
    title: 'Compliance Assured',
    context: `We abide by strict data and privacy laws.You're protected.`,
    imageSrc: '/assets/images/no-middleman-3.png',
    reverse: true,
  },
];

const NoMiddlemanPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={STATIC_DATA}>
      <Grid
        h="100vh"
        bgImage={{ base: '', md: "url('/assets/images/no-middleman.png')" }}
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Box mt={{ base: '2rem', md: 0 }} textAlign="center">
            <Content
              label="NO MIDDLEMAN. NO NONSENSE."
              content="Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what you get."
              showBtn={false}
            />
          </Box>
        </Container>
        <Box justifyContent="flex-end" display={{ base: 'block', md: 'none' }}>
          <Image src="/assets/images/no-middleman.png" alt="img" width={400} height={300} />
        </Box>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '10rem', md: 0 }}>
        <Text
          fontSize={{ base: '2.25rem', md: '3rem' }}
          textAlign="center"
          textTransform="uppercase"
          color="white"
          w={{ base: 400, md: 600 }}
        >
          No confusing fees. <br /> No shady data sharing.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default NoMiddlemanPage;
