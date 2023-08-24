import { Box, Button, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC } from 'react';

const Home: FC = () => {
  const router = useRouter();
  return (
    <Grid placeContent="center" h="100vh" gap="2">
      <Box display="flex" justifyContent="center">
        <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
      </Box>

      <Text color="primary" fontSize="3xl" textAlign="center" mb={{ base: '20rem', md: '10rem' }}>
        W<chakra.span color="white">allet</chakra.span>{' '}
      </Text>

      <Button variant="primary" borderRadius="xl" w={350} h={50} onClick={(): void => void router.push('/login')}>
        Login
      </Button>

      <Button variant="secondary" borderRadius="xl" w={350} h={50} onClick={(): void => void router.push('/register')}>
        Register
      </Button>

      <Text color="white" textAlign="center" mt="1rem" size="sm">
        QUX® is a registered trademark <br /> of QUX Technologies, Inc.
      </Text>

      <Flex justifyContent="space-between" color="primary" fontSize="1rem" mt="1rem">
        <Text>Term and Conditions</Text>
        <Text>Privacy Policy</Text>
      </Flex>
    </Grid>
  );
};

export default Home;
