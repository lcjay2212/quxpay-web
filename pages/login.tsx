import { Box, Button, chakra, Grid, Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const Login: FC = () => {
  const method = useForm();
  const router = useRouter();
  const { control, handleSubmit } = method;

  const onSubmit = ({ val }): void => {
    // eslint-disable-next-line no-console
    console.log(val);
  };

  return (
    <Grid placeContent="center" h="100vh" gap="2">
      <Box display="flex" justifyContent="center">
        <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
      </Box>

      <Text color="primary" fontSize="4xl" w={300} mt="2rem" ml="0.75rem">
        L<chakra.span color="white">ogin</chakra.span>
      </Text>

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
                  onChange={(e): void => {
                    onChange(e.target.value.toLowerCase());
                  }}
                  onBlur={onBlur}
                  isPassword
                />
              </FormContainer>
            )}
          />

          <Button type="submit" variant="primary" borderRadius="1rem" mt="1rem" w={350} h="3.25rem">
            Login
          </Button>
        </form>
      </FormProvider>

      <Text color="white" textAlign="center" mt="1rem">
        Forgot password?&nbsp;
        <chakra.span color="primary" cursor="pointer" onClick={(): void => void router.push('/forgot-password')}>
          Click here
        </chakra.span>
      </Text>
    </Grid>
  );
};

export default Login;
