import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { NO_MIDDLEMAN_MOCKS } from 'mocks/pages';
import Image from 'next/image';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const NoMiddlemanPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={NO_MIDDLEMAN_MOCKS} title="NO MIDDLEMAN. NO NONSENSE.">
      <Grid
        h="100vh"
        bgImage={{ base: '', md: "url('/assets/images/no-middleman.webp')" }}
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
          <Image src="/assets/images/no-middleman.webp" alt="img" width={400} height={300} placeholder="empty" />
        </Box>
      </Grid>

      <Flex justifyContent="center" mt={{ base: '10rem', md: 0 }}>
        <Text fontSize={{ base: '1.85rem', md: '3rem' }} textAlign="center" color="white" w={{ base: 400, md: 700 }}>
          No confusing fees. <br /> No shady data sharing.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default NoMiddlemanPage;
