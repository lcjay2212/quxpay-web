import { Container, Grid } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'Crystal Clear Fees',
    context: `The price you see is the price you pay. 
    No surprise charges popping up later.`,
    imageSrc: '/assets/images/QuxToken.png',
    reverse: true,
    alignItems: 'flex-end',
  },
  {
    title: 'User Data is Sacred',
    context: `We're not like your regular apps, we don't sell 
    or allow outside companies access to our systems 
    or user data for any reason. `,
    imageSrc: '/assets/images/safe identity.png',
    reverse: true,
  },
  {
    title: 'Compliance Assured',
    context: `We abide by strict data and privacy laws. 
    You're protected.`,
    imageSrc: '/assets/images/Compliance.png',
    reverse: true,
  },
];

const NoMiddlemanPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper label="No confusing fees. No shady data sharing." staticData={STATIC_DATA}>
      <Grid
        h="100vh"
        bgImage="url('/assets/images/no-middleman.png')"
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Content
            label="NO MIDDLEMAN. NO NONSENSE."
            content="Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what you get."
            showBtn={false}
          />
        </Container>
      </Grid>
    </PageWrapper>
  );
};

export default NoMiddlemanPage;
