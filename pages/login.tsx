import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { post } from 'constants/api';
import storage from 'constants/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useUser } from 'store/useUser';
import { notify } from 'utils/notify';

const Login: FC = () => {
  const method = useForm();
  const router = useRouter();
  const { control, handleSubmit } = method;
  const setUser = useUser((e) => e.setUser);

  const { mutate, isLoading } = useMutation((variable) => post('v/process-login', variable), {
    onSuccess: ({ data }) => {
      notify(`${data.status.message}`);
      localStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
      localStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
      setUser(JSON.parse(localStorage.QUX_PAY_USER_DETAILS));
      void router.push('/dashboard');
    },
    onError: ({ response }) => {
      notify(`${response?.data?.messages}`, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    mutate(val);
  };

  return (
    <Grid placeContent="center" h="100vh" gap="2">
      <Box display="flex" justifyContent="center">
        <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
      </Box>
      <Flex mt="2rem">
        <ArrowBackIcon
          color="white"
          mt="1.30rem"
          mr="1rem"
          cursor="pointer"
          onClick={(): void => void router.push('/')}
        />
        <Text color="primary" fontSize="4xl" w={300}>
          L<span style={{ color: 'white' }}>ogin</span>
        </Text>
      </Flex>

      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value = '', onBlur }, fieldState: { error } }): ReactElement => (
              <FormContainer label="Email" errorMessage={error?.message ?? ''}>
                <TextField
                  value={value ?? ''}
                  placeholder="Enter your email"
                  onChange={(e): void => {
                    onChange(e.target.value.toLowerCase());
                  }}
                  onBlur={onBlur}
                />
              </FormContainer>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value = '', onBlur }, fieldState: { error } }): ReactElement => (
              <FormContainer label="Password" errorMessage={error?.message ?? ''}>
                <TextField
                  value={value ?? ''}
                  placeholder="Enter your password"
                  onChange={onChange}
                  onBlur={onBlur}
                  isPassword
                />
              </FormContainer>
            )}
          />

          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt="1rem"
            w={350}
            h="3.25rem"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
      </FormProvider>

      <Text color="white" textAlign="center" mt="1rem">
        Forgot password?&nbsp;
        <span
          style={{ cursor: 'pointer', color: '#06A499' }}
          onClick={(): void => void router.push('/forgot-password')}
        >
          Click here
        </span>
      </Text>
    </Grid>
  );
};

export default Login;
