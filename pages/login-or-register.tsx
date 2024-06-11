import { Box, Button, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useRouteParams } from 'store/useRouteParams';

const LoginOrRegisterPage: FC = () => {
  const router = useRouter();
  const setParams = useRouteParams((e) => e.setParams);
  useEffect(() => setParams(router.query), [setParams, router]);

  const { mutate } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/login/cookie`, variable, {
        headers: {
          Version: 2,
          Cookie: 'qux_media_session=gYO4zweijJVfYSIb7dseSCiTVIXEamISzj2kvdqG',
        },
      }),
    {
      onSuccess: ({ data }) => {
        if (data?.data?.token) {
          void router.push('/dashboard');
        }
      },
    }
  );
  useEffect(() => {
    setTimeout(() => mutate(), 1000);
  }, [mutate]);

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

export default LoginOrRegisterPage;
