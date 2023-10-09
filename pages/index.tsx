import { Box, Button, Container, Flex, Grid, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PhoneImage, QuxPayLogoTwo } from 'public/assets';
import { FC } from 'react';

const Home: FC = () => {
  const router = useRouter();
  return (
    <Grid
      h="100vh"
      bgImage="url('/assets/images/BG.png')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize={3000}
    >
      <Container maxW="1920px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="flex" justifyContent="center">
            <Image src={QuxPayLogoTwo} height={100} width={250} alt="Qux Logo" />
          </Box>

          <Flex gap={4}>
            <Button
              variant="primary"
              borderRadius="3xl"
              w={120}
              h={50}
              onClick={(): void => void router.push('/login')}
            >
              Login
            </Button>

            <Button
              variant="secondary"
              borderRadius="3xl"
              w={120}
              h={50}
              onClick={(): void => void router.push('/register')}
            >
              Register
            </Button>
          </Flex>
        </Flex>

        <Flex placeContent="center">
          <Image src={PhoneImage} height={300} width={600} alt="Phone Image" />
        </Flex>
        <Text fontSize="37px" textTransform="uppercase" textAlign="center" color="white">
          Pay Like It's <br /> Nobody's Business.
          <br /> Because It Isn't.
        </Text>
      </Container>
    </Grid>
  );
};

export default Home;
