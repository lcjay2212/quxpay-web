import { Grid, Image } from '@chakra-ui/react';
import { FC } from 'react';

const Home: FC = () => (
  <Grid placeContent="center" h="100vh">
    <Image src="/image/qux-logo.png" alt="Qux Logo" />
  </Grid>
);

export default Home;
