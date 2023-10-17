import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { TRANSFERS_MOCKS } from 'mocks/pages';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const TransfersPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={TRANSFERS_MOCKS} my="10rem" justifyContent="center" textAlign="center">
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
