import { Container, Grid } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    title: 'Backed by Bank-Level Protocols',
    context: `Multilayered security protections follow the strictest 
    protocols used by financial institutions worldwide. 
    Fort Knox level.`,
    imageSrc: '/assets/images/military-grade-security-1.png',
    reverse: false,
  },
  {
    title: 'Patent-Pending Encryption Mesh',
    context: `QuxPay utilizes a global encryption mesh 
    infrastructure allowing each device to pay 
    in real-time. Big words but the point is - 
    there's no central point of failure. Hacks 
    and data breaches can't happen.`,
    imageSrc: '/assets/images/military-grade-security-2.png',
    reverse: true,
  },
  {
    title: 'Anonymous Transactions',
    context: `Every payment is anonymized using industry
    leading tools. Your identity stays hidden, even
    from us. Totally private.`,
    imageSrc: '/assets/images/military-grade-security-3.png',
    reverse: true,
  },
];

const MilitaryGradeSecurityPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper label="Hacker-proof. Unbreakable. Impenetrable." staticData={STATIC_DATA}>
      <Grid
        h="120vh"
        bgImage="url('/assets/images/military-grade-security.png')"
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
    </PageWrapper>
  );
};

export default MilitaryGradeSecurityPage;
