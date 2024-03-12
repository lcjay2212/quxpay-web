import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { PAYMENTS_MADE_PERFECT_MOCKS } from 'mocks/pages';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const PaymentsMadePerfectPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={PAYMENTS_MADE_PERFECT_MOCKS} title="payments-made-perfect">
      <Grid
        h={{ base: 'auto', md: '100vh' }}
        bgImage={{ base: '', md: "url('/assets/images/payments-made-perfect.webp')" }}
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
            <Image
              src="/assets/images/payments-made-perfect-4.webp"
              alt="img"
              width={400}
              height={300}
              placeholder="empty"
            />
          </Box>
        </Container>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '5rem', md: 0 }}>
        <Text fontSize={{ base: '2.25rem', md: '3rem' }} textAlign="center" color="white" w={{ base: 300, md: 500 }}>
          Zero junk fees. Sky is the limit.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default PaymentsMadePerfectPage;
