import { Container, Grid } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'No Clearing Delays',
    context: `Unlike cryptos and banks, once your money 
    is converted into QUX Tokens, there are no 
    multi-day waits for transfers to finalize. 
    Payments are instantly accessible.`,
    imageSrc: '/assets/images/transfers-1.png',
    reverse: true,
  },
  {
    title: 'Recipient Notifications',
    context: `We instantly notify recipients via push 
    notification when funds are received in 
    their account within milliseconds.`,
    imageSrc: '/assets/images/transfers-2.png',
    reverse: true,
  },
];

const TransfersPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper
      label="No wait times. Lightning fast digital transactions."
      staticData={STATIC_DATA}
      my="10rem"
      justifyContent="center"
      textAlign="center"
    >
      <Grid
        h="120vh"
        bgImage="url('/assets/images/transfers.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Content
            label="P2P Payments Made Perfect"
            content="Pay friends, family, contacts instantly. No fees, no limits. Spend on the move."
            showBtn={false}
            mt="25rem"
          />
        </Container>
      </Grid>
    </PageWrapper>
  );
};

export default TransfersPage;
