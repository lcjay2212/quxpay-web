import { Box, BoxProps, Container, Flex, Heading, Text } from '@chakra-ui/react';
import Footer from 'component/Footer';
import Head from 'next/head';
import Image from 'next/image';
import { FC, ReactElement } from 'react';

interface Props {
  staticData?: {
    title: string;
    context: string;
    imageSrc: string;
    reverse: boolean;
    alignItems?: string;
  }[];
  label: string;
  children: ReactElement;
}

const PageWrapper: FC<Props & BoxProps> = ({ staticData, label, children, ...props }) => {
  return (
    <Box bg="#3D075F">
      <Head>
        <title>Quxpay</title>
        <meta name="description" content="Quxpay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}

      <Flex justifyContent="center" {...props}>
        <Text fontSize="3rem" textAlign="center" textTransform="uppercase" color="white" w={600}>
          {label}
        </Text>
      </Flex>

      <Container maxW="1080px">
        {staticData?.map((item, index) => (
          <Flex
            justifyContent="center"
            alignItems={item.alignItems ?? 'center'}
            key={index}
            flexDir={!item.reverse ? 'row' : 'row-reverse'}
            gap={12}
            my="12rem"
          >
            <Box w={470} color="white">
              <Heading fontSize="48px" fontWeight="normal">
                {item.title}
              </Heading>
              <Text fontSize="24px" my="1.5rem">
                {item.context}
              </Text>
            </Box>

            <Image
              src={item.imageSrc}
              width={600}
              height={500}
              alt="test"
              placeholder="blur"
              style={{ objectFit: 'contain' }}
              blurDataURL={'data:image/jpeg...'}
            />
          </Flex>
        ))}
      </Container>

      <Box
        h="100vh"
        bgImage="url('/assets/images/BG-5.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        my="15rem"
      />
      <Footer />
    </Box>
  );
};

export default PageWrapper;
