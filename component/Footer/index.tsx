import { Box, Container, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { QuxPayLogoPng } from 'public/assets';
import { FC } from 'react';

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
            <Image src={QuxPayLogoPng} height={100} width={200} alt="Qux Logo" />
          </Box>
          <Box my={{ base: '1rem', md: '2rem' }}>
            {footerLink.map((item) => (
              <Link href={item.routes} key={item.label}>
                <Text color="white" fontSize={{ base: '20px', md: '29px' }} fontWeight="bold" my="0.5rem">
                  {item.label}
                </Text>
              </Link>
            ))}
          </Box>
          <Box color="white">
            <Image src="/assets/images/google-play.png" alt="Google Play and App Store" width={300} height={100} />
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
            QUXPay is not a bank, banking services provided by QUXPay’s bank partner(s). Debit cards issued by Sutton
            Bank, pursuant to a license from Visa USA Inc.
          </Text>
          <Text>
            QUXPay waives ATM fees for all in-network withdrawals every month you have at least $300 direct deposited
            into your Cash balance. Additional information here.
          </Text>
          <Text>
            Brokerage services by QUXPay, member FINRA/SIPC, subsidiary of Block, Inc. See our BrokerCheck. Bitcoin
            services provided by Block, Inc. Investing involves risk; you may lose money. QUXPay Investing does not
            trade bitcoin and Block, Inc. is not a member of FINRA or SIPC. For additional information, see the Bitcoin
            and QUXPay Investing disclosures.
          </Text>
          <Text>
            Fractional shares are not transferable. For a complete explanation of conditions, restrictions and
            limitations associated with fractional shares, see our Customer Agreement.
          </Text>
        </Flex>
      </Container>
      <Box
        h={{ base: '31vh', md: '125vh' }}
        bgImage="url('/assets/images/Footer.png')"
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
