import { Box, Container, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { openInNewTab } from 'utils';

const footerLink = [
  {
    label: 'Legal',
    routes: 'https://qux.tv/terms-and-condition',
  },
  {
    label: 'Refunds',
    routes: 'https://qux.tv/return-policy',
  },
  {
    label: 'Privacy Policy',
    routes: 'https://qux.tv/privacy-policy',
  },
  {
    label: 'Blog',
    routes: 'https://blog.quxpay.com/',
  },
  // {
  //   label: 'Security',
  //   routes: 'https://blog.quxpay.com/security',
  // },
  // {
  //   label: 'Press',
  //   routes: 'https://blog.quxpay.com/press',
  // },
  // {
  //   label: 'Help',
  //   routes: 'https://blog.quxpay.com/help',
  // },
  {
    label: 'FAQs',
    routes: '/faqs',
  },
  // {
  //   label: 'Status',
  //   routes: 'https://blog.quxpay.com/status',
  // },
];

export const Footer: FC = () => {
  const date = new Date();

  return (
    <Box bg="#171742">
      <Container maxW="1080px" color="white">
        <Flex
          fontSize={{ base: '1rem', md: '29px' }}
          flexDir="column"
          gap={{ base: 6, md: 12 }}
          py={{ base: '2rem', md: '5rem' }}
        >
          <Text>
            QUX Technologies, Inc.™. maintains a “Know Your Customer” (KYC) standard designed to protect financial
            institutions against fraud, corruption, money laundering and terrorist financing. QUX Technologies, Inc.™
            KYC policy involves several steps to 1) establish customer identity; 2) understand the nature of user's
            activities and qualify that sources of funds are legitimate; and 3) assess money laundering risks associated
            with users.
          </Text>
          <Text>
            QUX Technologies™, QUX eToken® and QUX Pay® are not a bank, but rather are financial technology companies.
          </Text>
          <Text>
            Nothing contained in this website constitutes legal advice by these related companies. You are encouraged to
            consult with your legal advisors to evaluate all information provided.
          </Text>
          <Text>
            QUX Technologies, Inc.™. maintains compliance with Anti-Money Laundering laws (AML) and U.S. Department of
            Treasury's Financial Crimes Enforcement Network (FinCEN) through internal audits of all QUX eToken®
            purchases and redemptions. All users of QUX eToken® who redeem over $600 per year shall receive a 1099-K or
            1099-Misc form at the end of the year.
          </Text>
          <Text>
            QUX eToken® are only integral to QUX Pay® and QUXStore™. The sale of QUX eToken® does not constitute money
            transmission services. Purchases of QUX eToken® are necessary to use QUX Pay® and QUXStore™.
          </Text>
          <Text>
            In order to use QUX eToken®, one must register and create an account through QUX Pay® or the QUX® General
            Dashboard. QUX eToken® can only be purchased or redeemed through a registered user’s bank account(s). QUX
            Pay® and QUXStore™ can only be used to purchase or redeem QUX eToken® through QUX Technologies, Inc.™.
          </Text>
          <Text>
            QUX Technologies, Inc.™. limits the purchase of QUX eToken® of any user to 2,000 in any one day. QUX
            eToken®, QUX Pay® and QUXStore™ policies and procedures limited QUX eToken® redemptions to 10,000 or less
            from any one user in any one day.
          </Text>
          <Text>
            QUX Technologies, Inc.™., QUX eToken® and QUX Pay® have a{' '}
            <u onClick={(): void => openInNewTab('https://qux.tv/privacy-policy')} style={{ cursor: 'pointer' }}>
              Privacy Policy
            </u>{' '}
            that the collection and use of information that is collected as data will not be distributed to third
            parties without consent of the customer. QUX Technologies, Inc.™., QUX eToken® and QUX Pay® do not have
            regulator endorsements, implied or expressed related to information contained herein or related to QUX
            Technologies, Inc.™., QUX eToken® and QUX Pay®.
          </Text>
          <Text>
            QUX Technologies, Inc.™., QUX eToken® and QUX Pay® strive to insure that its services are accessible to
            people with disabilities.
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
      <Container maxW="1080px" color="white">
        <Flex justifyContent="space-between" flexDir={{ base: 'column', md: 'row' }} py={{ base: '2rem', md: '5rem' }}>
          <Box fontSize={{ base: '0.75rem', md: '12px', lg: '20px' }}>
            <Image src="/assets/images/quxpay-logo.webp" height={100} width={200} alt="Qux Logo" placeholder="empty" />
            <Text>QUX Pay®</Text>
            <Text>9107 Yale Rd.</Text>
            <Text>Diamond, OH 44412</Text>
            <Text>info@quxnow.com</Text>
            <Text>Toll Free: 877-7000-QUX</Text>
          </Box>
          <Box my={{ base: '1rem', md: '2rem' }}>
            {footerLink.map((item) => (
              <Link href={item.routes} key={item.label}>
                <Text
                  color="white"
                  fontSize={{ base: '20px', md: '16px', lg: '29px' }}
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
            <Flex
              justify="center"
              alignItems="center"
              borderRadius="xl"
              border="3px solid #D222A8"
              bg="white"
              gap={3}
              p="1rem"
            >
              <Image src="/assets/images/qr1.png" height={100} width={100} alt="QR" />
              <Flex flexDirection="column" gap={4}>
                <Box
                  cursor="pointer"
                  onClick={(): void =>
                    void window.open(
                      'https://play.google.com/store/apps/details?id=com.qux.quxpay.android&hl=en-US',
                      'noopener,noreferrer'
                    )
                  }
                >
                  <Image src="/assets/images/google-play.png" height={150} width={150} alt="QR" />
                </Box>

                <Box
                  cursor="pointer"
                  onClick={(): void =>
                    void window.open('https://apps.apple.com/us/app/quxpay/id6499033621', 'noopener,noreferrer')
                  }
                >
                  <Image src="/assets/images/app-store.png" height={150} width={150} alt="QR" />
                </Box>
              </Flex>
            </Flex>
            <Text
              fontSize={{ base: '20px', md: '16px', lg: '29px' }}
              fontWeight="bold"
              mt={{ base: '1rem', md: '2rem' }}
            >
              Business Hours
            </Text>
            <Text fontSize={{ base: '0.75rem', md: '12px', lg: '20px' }}>
              9am - 7pm EST,
              <br /> Monday to Friday
            </Text>
          </Box>
        </Flex>
      </Container>
      <Box
        bg="#D222A8"
        color="white"
        fontSize={{ base: '0.75rem', md: '20px' }}
        fontWeight="bold"
        textAlign="center"
        py="0.5rem"
      >
        <Text>© {date.getFullYear()} QUX Technologies, Inc.™. . All Rights Reserved.</Text>
      </Box>
    </Box>
  );
};
