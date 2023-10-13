import { Container, Grid } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
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
    <PageWrapper label="Zero junk fees. Sky is the limit." staticData={STATIC_DATA}>
      <Grid
        h="100vh"
        bgImage="url('/assets/images/payments-made-perfect.png')"
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
        </Container>
      </Grid>
    </PageWrapper>
  );
};

export default PaymentsMadePerfectPage;
