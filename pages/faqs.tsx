import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Grid,
  Heading,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import PageWrapper from 'component/PageWrapper';
import TopBarHeader from 'component/TopBarHeader';
import { FAQS_STATIC_DATA } from 'mocks/faqs';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const MilitaryGradeSecurityPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper>
      <Grid
        h={{ base: 'auto', md: '220vh' }}
        bgImage="url('/assets/images/faqs-background.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />

          <Heading
            fontSize={{ base: '1.75rem', md: '3rem' }}
            color="white"
            textAlign="center"
            textTransform="uppercase"
            my={{ base: '2rem', md: '6rem' }}
          >
            FREQUENTLY asked
            <br /> questions
          </Heading>

          <Accordion bg="#3D075F" color="white" mb={{ base: '2rem', md: 0 }} border="white">
            {FAQS_STATIC_DATA.map((item, index) => {
              return (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize={{ base: '1rem', md: '1.5rem' }}
                        fontWeight="bold"
                        px="1rem"
                        py="0.75rem"
                      >
                        {item.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel mx={{ base: '1rem', md: '2rem' }}>
                    <UnorderedList>
                      <ListItem fontSize={{ base: '0.75rem', md: '1.25rem' }} mb={{ base: '0.5rem', md: '1rem' }}>
                        {item.answers}
                      </ListItem>
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Container>
      </Grid>
    </PageWrapper>
  );
};

export default MilitaryGradeSecurityPage;
