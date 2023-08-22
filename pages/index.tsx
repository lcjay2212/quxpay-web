import { Button, chakra, Grid, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { QuxLogo } from 'public/assets';
import { FC } from 'react';

const Home: FC = () => (
  <Grid placeContent="center" h="100vh" gap="12">
    <Grid gap="2">
      <Image src={QuxLogo} height={70} width={135} alt="Qux Logo" />

      <Text color="primary" fontSize="3xl" textAlign="center">
        W<chakra.span color="white">allet</chakra.span>{' '}
      </Text>
    </Grid>

    <Grid>
      <Button variant="primary">Login</Button>
    </Grid>
  </Grid>
);

export default Home;
