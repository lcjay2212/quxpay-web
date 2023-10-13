import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'Transfer Limits? What is that?',
    context: `Send as much as you want. No annoying 
    restrictions on payment amounts. 
    Total freedom.`,
    imageSrc: '/assets/images/payments-made-perfect-1.png',
    reverse: true,
  },
  {
    title: 'Zero Fees. Ever.',
    context: `Forget fees eating into transfers. 
    QuxPay is absolutely free for P2P payments. 
    Keep more in your wallet.`,
    imageSrc: '/assets/images/payments-made-perfect-2.png',
    reverse: true,
  },
];

const PaymentsMadePerfectPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={STATIC_DATA}>
      <Grid
        h={{ base: 'auto', md: '100vh' }}
        bgImage={{ base: '', md: "url('/assets/images/payments-made-perfect.png')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Content
            label="P2P Payments Made Perfect"
            content="Pay friends, family, contacts instantly. No fees, no limits. Spend on the move."
            showBtn={false}
          />
          <Box display={{ base: 'block', md: 'none' }}>
            <Image src="/assets/images/payments-made-perfect-4.png" alt="img" width={400} height={300} />
          </Box>
        </Container>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '5rem', md: 0 }}>
        <Text
          fontSize={{ base: '2.25rem', md: '3rem' }}
          textAlign="center"
          textTransform="uppercase"
          color="white"
          w={{ base: 300, md: 400 }}
        >
          Zero junk fees. Sky is the limit.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default PaymentsMadePerfectPage;
