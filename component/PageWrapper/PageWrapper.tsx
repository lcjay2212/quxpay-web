import { Box, BoxProps, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { Footer, SEO } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Pages } from 'typings';

interface Props {
  title: Pages;
  staticData?: {
    title: string;
    context: string;
    imageSrc: string;
    reverse: boolean;
    alignItems?: string;
  }[];
}

export const PageWrapper: FC<Props & BoxProps> = ({ title, staticData, children }) => {
  const { pathname } = useRouter();
  return (
    <Box bg="#3D075F">
      <SEO page={title} />
      {children}

      <Container maxW="1080px">
        {staticData?.map((item, index) => (
          <Flex
            justifyContent="center"
            alignItems={{ base: 'center', md: item.alignItems ?? 'center' }}
            key={index}
            flexDir={!item.reverse ? { base: 'column', md: 'row' } : { base: 'column', md: 'row-reverse' }}
            gap={12}
            my={{ base: '8rem', md: '12rem' }}
          >
            <Box w={{ base: 350, md: 470 }} color="white" textAlign={{ base: 'center', md: 'start' }}>
              <Heading fontSize={{ base: '2rem', md: '48px' }} fontWeight="extrabold" fontFamily="'Coda', sans-serif">
                {item.title}
              </Heading>
              <Text fontSize={{ base: '1rem', md: '24px' }} my="1.5rem">
                {item.context}
              </Text>
            </Box>

            <Image
              src={item.imageSrc}
              width={600}
              height={500}
              alt={item.title}
              style={{ objectFit: 'contain' }}
              placeholder="empty"
            />
          </Flex>
        ))}
      </Container>

      {pathname !== '/faqs' && (
        <>
          <Box
            display={{ base: 'block', md: 'none' }}
            mx="2rem"
            color="white"
            textAlign={{ base: 'center', md: 'start' }}
          >
            <Heading fontSize={{ base: '1.85rem', md: '48px' }} fontWeight="normal">
              The Future of Payments. Today.
            </Heading>
            <Text fontSize={{ base: '1.15rem', md: '24px' }} my="1.5rem">
              Amount transferred through QUXPay™ reaches its destination almost instantly. As quick as sending a text.
              No more waiting around like crypto.
            </Text>
          </Box>

          <Box
            h={{ base: '300px', md: '100vh' }}
            bgImage="url('/assets/images/BG-5.webp')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            my={{ base: '5rem', md: '15rem' }}
          />
        </>
      )}
      <Footer />
    </Box>
  );
};
