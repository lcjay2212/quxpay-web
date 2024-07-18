import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import { PageWrapper, TopBarHeader } from 'component';
import { TRANSFERS_MOCKS } from 'mocks/pages';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store';

const TransfersPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={TRANSFERS_MOCKS} title="transfers" my="10rem" justifyContent="center" textAlign="center">
      <Grid
        h={{ base: 'auto', md: '120vh' }}
        bgImage={{ base: '', md: "url('/assets/images/transfers.webp')" }}
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
        <Box display={{ base: 'flex', md: 'none' }} placeContent="center">
          <Image src="/assets/images/transfers.webp" alt="img" width={400} height={300} placeholder="empty" />
        </Box>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '10rem', md: '20rem' }}>
        <Text fontSize={{ base: '1.5rem', md: '3rem' }} textAlign="center" color="white" w={{ base: 400, md: 'auto' }}>
          No wait times.
          <br /> Lightning fast digital <br /> transactions.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default TransfersPage;
