import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import axios from 'axios';
import storage from 'constants/storage';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxpayAndQuxLogo } from 'public/assets';
import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useRouteParams, useUser } from 'store';
import { notify } from 'utils';

const LoginOrRegisterPage: FC = () => {
  const router = useRouter();
  const setParams = useRouteParams((e) => e.setParams);
  const params = useRouteParams((e) => e.params);
  useEffect(() => setParams(router.query), [setParams, router]);
  const setUser = useUser((e) => e.setUser);
  const { mutate } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/login/sso`, variable, {
        headers: {
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        if (data?.data?.token) {
          localStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
          localStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
          setUser(JSON.parse(localStorage.QUX_PAY_USER_DETAILS));
          void router.push('/checkout');
        }
      },
      onError: ({ response }) => {
        notify(`${response?.data?.status?.message || 'Login Failed'}`, { status: 'error' });
      },
    }
  );
  useEffect(() => {
    if (params.sso) {
      const sso_key = params.sso?.replace(/ /g, '+');
      void mutate({
        sso_key,
      } as any);
    }
  }, [mutate, params]);

  return (
    <Grid placeContent="center" h="100vh" gap="2">
      <Box display="flex" justifyContent="center" mb={{ base: '20rem', md: '10rem' }}>
        <Image src={QuxpayAndQuxLogo} height={50} width={300} alt="Qux Logo" />
      </Box>

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
