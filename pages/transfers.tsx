import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import Image from 'next/image';
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
    <PageWrapper staticData={STATIC_DATA} my="10rem" justifyContent="center" textAlign="center">
      <Grid
        h={{ base: 'auto', md: '120vh' }}
        bgImage={{ base: '', md: "url('/assets/images/transfers.png')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Content
            label="Transfers in a Flash"
            content="Amount transferred through QuxPay reaches its destination almost instantly. As quick as sending a text. No more waiting around like crypto."
            showBtn={false}
            mt={{ base: '2rem', md: '25rem' }}
          />
        </Container>
        <Box display={{ base: 'block', md: 'none' }}>
          <Image src="/assets/images/transfers.png" alt="img" width={400} height={300} />
        </Box>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '10rem', md: '20rem' }}>
        <Text
          fontSize={{ base: '1.95rem', md: '3rem' }}
          textAlign="center"
          textTransform="uppercase"
          color="white"
          w={{ base: 400, md: 600 }}
        >
          No wait times. Lightning fast digital transactions.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default TransfersPage;
