import { Box, Button, chakra, Grid, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { QuxPayLogo } from 'public/assets';
import { FC } from 'react';

const Home: FC = () => (
  <Grid placeContent="center" h="100vh" gap="2">
    <Box display="flex" justifyContent="center">
      <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
    </Box>

    <Text color="primary" fontSize="3xl" textAlign="center">
      W<chakra.span color="white">allet</chakra.span>{' '}
    </Text>

    <Button variant="primary" borderRadius="xl" w={300} px={2}>
      Login
    </Button>

    <Button variant="secondary" borderRadius="xl">
      Register
    </Button>
  </Grid>
);

export default Home;
