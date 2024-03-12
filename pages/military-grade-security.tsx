import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { MILITARY_GRADE_SECURITY_MOCK } from 'mocks/pages';
import { Content } from 'pages';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const MilitaryGradeSecurityPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper staticData={MILITARY_GRADE_SECURITY_MOCK} title="military-grade-security">
      <Grid
        h="120vh"
        bgImage={{
          base: "url('/assets/images/military-grade-security-4.webp')",
          md: "url('/assets/images/military-grade-security.webp')",
        }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />
          <Box w={{ base: '360px', md: 'auto' }} m={{ base: 'auto' }}>
            <Content
              label="Military-Grade Security"
              content="QuxPay utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private."
              showBtn={false}
            />
          </Box>
        </Container>
      </Grid>

      <Flex justifyContent="center">
        <Text fontSize={{ base: '2.25rem', md: '3rem' }} textAlign="center" color="white">
          Hacker-proof. Unbreakable.
          <br /> Impenetrable.
        </Text>
      </Flex>
    </PageWrapper>
  );
};

export default MilitaryGradeSecurityPage;
