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
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    question: 'How do I send QuxTokens to someone?',
    answers: `Send QuxTokens by entering the recipient's @username in the app.`,
  },
  {
    question: 'Does the recipient need a QuxPay account to get my QuxTokens?',
    answers: `Yes, the recipient needs to have a QuxPay account to receive your QuxToken transfers. It's free and fast to sign up.`,
  },
  {
    question: 'How will the recipient know when I send QuxTokens?',
    answers: `The recipient will receive instant in-app and push notifications when you transfer QuxTokens.`,
  },
  {
    question: 'What info will recipients see when I send them QuxTokens?',
    answers: `Recipients will see your username.`,
  },
  {
    question: 'What if I sent QuxTokens to the wrong person?',
    answers: `As much as possible be very careful and double check usernames. Contact support at info@quxtech.com for help.`,
  },
  {
    question: 'Does QuxPay work for international QuxToken transfers? ',
    answers: `We'd love to expand! However, we're currently only available in the US.`,
  },
  {
    question: 'Is there a limit on how many QuxTokens I can send?',
    answers: `No maximum limits on sending QuxTokens but there is a requirement of 1 QuxToken to be able to send. 1 QuxToken = $20 USD.`,
  },
  {
    question: 'What fees does QuxPay charge to send QuxTokens? ',
    answers: `3% fees for cash in and cash out. User to user transfers are free.`,
  },
  {
    question: 'How long do transfers take to complete?',
    answers: `User to user transfers are instant. Cash in/out takes 1-3 banking days.`,
  },
  {
    question: 'Is QuxPay secure? How is my data protected? ',
    answers: `We take security and privacy very seriously. See our privacy policy. `,
  },
  {
    question: 'Does QuxPay share or sell user data? ',
    answers: `We never share or sell user data. See our T&C and privacy policy.
    `,
  },
  {
    question: 'How do I withdraw QuxTokens from my account? (step-by-step)',
    answers: ``,
  },
  {
    question: 'Can I close my QuxPay account if needed? ',
    answers: `Yes, just e-mail our support at info@quxtech.tv for more information and assistance.`,
  },
  {
    question: 'What do I do if I lose access to my account? ',
    answers: ` You can reset your e-mail by clicking the "Forget Password. Make sure the e-mail you used to log-in is still active. You'll receive a link to change your password. If you need more help, e-mail info@quxtech.tv`,
  },
  {
    question: 'How does QuxPay handle disputes or fraud? ',
    answers: `Our dispute resolution process at QuxPay ensures fair and timely resolutions for customers. Please e-mail us at info@quxtech.tv for assistance`,
  },
];

const MilitaryGradeSecurityPage: FC = () => {
  const visible = useHomePageModal(({ visible }) => visible);
  return (
    <PageWrapper>
      <Grid
        h="220vh"
        bgImage={{
          base: "url('/assets/images/faqs-background.png')",
          md: "url('/assets/images/faqs-background.png')",
        }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={visible ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
          <TopBarHeader />

          <Heading fontSize="3rem" color="white" textAlign="center" textTransform="uppercase" my="6rem">
            FREQUENTLY asked
            <br /> questions
          </Heading>

          <Accordion bg="#3D075F" color="white">
            {STATIC_DATA.map((item, index) => {
              return (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize="1.5rem"
                        fontWeight="bold"
                        px="1rem"
                        py="0.5rem"
                      >
                        {item.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel mx="2rem">
                    <UnorderedList>
                      <ListItem>{item.answers}</ListItem>
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
