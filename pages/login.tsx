import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { CaptchaModal, FormContainer, PendingAccountModal, TextField } from 'component';
import { VerifyOtpForm } from 'component/VerifyOtpForm';
import { LoginRequest } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useCaptchaModal, useVerifyOtp } from 'store';
import { useLogin } from 'store/useLogin';

const Login: FC = () => {
  const method = useForm<LoginRequest>();
  const router = useRouter();
  const { control, handleSubmit, getValues } = method;

  const captchaModalVisible = useCaptchaModal((e) => e.visible);
  const { login } = useLogin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const type = (login.data as any)?.type ?? 'login';

  const onSubmit = (val: LoginRequest): void => {
    login.mutate(val);
  };

  const verify = useVerifyOtp((e) => e.verify);

  return (
    <Grid placeContent="center" h="100vh" gap="2">
      {!verify ? (
        <>
          <Box display="flex" justifyContent="center">
            <Image src="/assets/images/qux-pay-logo.webp" height={70} width={135} alt="Qux Logo" />
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
                  <FormContainer label="Email" errorMessage={error?.message || ''}>
                    <TextField
                      value={value}
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
                  <FormContainer label="Password" errorMessage={error?.message || ''}>
                    <TextField
                      value={value}
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
                isLoading={login.isPending}
              >
                Login
              </Button>

              {captchaModalVisible && <CaptchaModal label="login" />}
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
        </>
      ) : (
        <VerifyOtpForm email={getValues('email')} type={type || 'login'} />
      )}

      <PendingAccountModal />
    </Grid>
  );
};

export default Login;
