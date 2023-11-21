import { Box, Container, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { QuxPayLogoPng } from 'public/assets';
import { FC } from 'react';
import { openInNewTab } from 'utils/openNewTab';

const footerLink = [
  {
    label: 'Legal',
    routes: '/',
  },
  {
    label: 'Licenses',
    routes: '/',
  },
  {
    label: 'Security',
    routes: '/',
  },
  {
    label: 'Press',
    routes: '/',
  },
  {
    label: 'Help',
    routes: '/',
  },
  {
    label: 'FAQs',
    routes: '/faqs',
  },
  {
    label: 'Status',
    routes: '/',
  },
];

const Footer: FC = () => {
  const date = new Date();
  return (
    <Box bg="#171742">
      <Container maxW="1080px" color="white">
        <Flex justifyContent="space-between" flexDir={{ base: 'column', md: 'row' }} py={{ base: '2rem', md: '5rem' }}>
          <Box>
            <Image src={QuxPayLogoPng} height={100} width={200} alt="Qux Logo" placeholder="empty" />
          </Box>
          <Box my={{ base: '1rem', md: '2rem' }}>
            {footerLink.map((item) => (
              <Link href={item.routes} key={item.label}>
                <Text
                  color="white"
                  fontSize={{ base: '20px', md: '29px' }}
                  fontWeight="bold"
                  my="0.5rem"
                  _hover={{
                    color: 'primary',
                  }}
                >
                  {item.label}
                </Text>
              </Link>
            ))}
          </Box>
          <Box color="white">
            <Image
              src="/assets/images/google-play.webp"
              alt="Google Play and App Store"
              width={300}
              height={100}
              placeholder="empty"
            />
            <Text
              fontSize={{ base: '20px', md: '29px' }}
              fontWeight="bold"
              mb="0.5rem"
              my={{ base: '1rem', md: '2rem' }}
            >
              Contact Us
            </Text>
            <Text fontSize={{ base: '0.75rem', md: '20px' }}>
              1 (800) 234-5678 <br /> 9am - 7pm EST,
              <br /> Monday to Friday
            </Text>
          </Box>
        </Flex>

        <Flex
          fontSize={{ base: '1rem', md: '29px' }}
          flexDir="column"
          gap={{ base: 6, md: 12 }}
          py={{ base: 0, md: '2rem' }}
        >
          <Text>
            QUX Technologies, Inc™ maintains a “Know Your Customer” (KYC) standard designed to protect financial
            institutions against fraud, corruption, money laundering and terrorist financing. QUX Technologies, Inc™’s
            KYC policy involves several steps to 1) establish customer identity; 2) understand the nature of user’s
            activities and qualify that sources of funds are legitimate; and 3) assess money laundering risks associated
            with users.
          </Text>
          <Text>
            QUX Technologies™, QUX® Tokens and QUXPay™ are not a bank, but rather are financial technology companies.
          </Text>
          <Text>
            Nothing contained in this website constitutes legal advice by these related companies. You are encouraged to
            consult with your legal advisors to evaluate all information provided.
          </Text>
          <Text>
            QUX Technologies, Inc™ maintains compliance with Anti-Money Laundering laws (AML) and U.S. Department of
            Treasury's Financial Crimes Enforcement Network (FinCEN) through internal audits of all QUX® Token purchases
            and redemptions. All users of QUX® Tokens who redeem over $600 per year shall receive a 1099-K or 1099-Misc
            form at the end of the year.
          </Text>
          <Text>
            QUX® Tokens are only integral to QUXPay™ and QUX® Stores. The sale of QUX® Tokens does not constitute money
            transmission services. Purchases of QUX® Tokens are necessary to use QUXPay™ and QUX® Stores.
          </Text>
          <Text>
            In order to use QUX® Tokens, one must register and create an account through QUXPay™ or the QUX® General
            Dashboard. QUX® Tokens can only be purchased or redeemed through a registered user’s bank account(s).
            QUXPay™ and QUX® Stores can only be used to purchase or redeem QUX® Tokens through QUX Technologies, Inc™.
          </Text>
          <Text>
            QUX Technologies, Inc™ limits the purchase of QUX® Tokens of any user to 2,000 in any one day. QUX® Tokens,
            QUXPay™ and QUX® Store policies and procedures limited QUX® Token redemptions to 10,000 or less from any one
            user in any one day.
          </Text>
          <Text>
            QUX Technologies™, QUX® Tokens and QUXPay™ have a{' '}
            <u onClick={(): void => openInNewTab('quxtech.tv/privacy-policy')} style={{ cursor: 'pointer' }}>
              Privacy Policy
            </u>{' '}
            that the collection and use of information that is collected as data will not be distributed to third
            parties without consent of the customer. QUX Technologies™, QUX® Tokens and QUXPay™ do not have regulator
            endorsements, implied or expressed related to information contained herein or related to QUX Technologies™,
            QUX® Tokens and QUXPay™.
          </Text>
          <Text>
            QUX Technologies™, QUX® Tokens and QUXPay™ strive to insure that its services are accessible to people with
            disabilities.
          </Text>
        </Flex>
      </Container>
      <Box
        h={{ base: '31vh', md: '125vh' }}
        bgImage="url('/assets/images/Footer.webp')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={{ base: 'contain', md: 'cover' }}
      >
        <Container maxW="1080px" pt={{ base: 0, md: '1rem' }}>
          <Text fontSize={{ base: '1rem', md: '29px' }} color={'white'}>
            Additional fees for securities may apply such as regulatory fees and fees to transfer securities externally.
            Please see our House Rules for more information.
          </Text>
        </Container>
      </Box>
      <Box
        bg="#D222A8"
        color="white"
        fontSize={{ base: '0.75rem', md: '20px' }}
        fontWeight="bold"
        textAlign="center"
        py="0.5rem"
      >
        <Text>© {date.getFullYear()} QUX® Technologies, Inc. . All Rights Reserved.</Text>
      </Box>
    </Box>
  );
};

export default Footer;
