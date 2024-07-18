import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { FormContainer, TextField } from 'component';
import { post } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { notify } from 'utils/notify';

const ForgotPassword: FC = () => {
  const method = useForm();
  const router = useRouter();
  const { control, handleSubmit } = method;

  const { mutate, isLoading } = useMutation((variable) => post('web/forgot-password', variable), {
    onSuccess: ({ data }) => {
      notify(`${data.status.message}`);
      void router.push('/login');
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

      <Flex mt="2rem" alignItems="center">
        <ArrowBackIcon
          color="white"
          mt="8px"
          mr="1rem"
          cursor="pointer"
          onClick={(): void => void router.push('/login')}
        />
        <Text color="primary" fontSize="4xl">
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

          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt="1rem"
            w={350}
            h="3.25rem"
            isLoading={isLoading}
          >
            Send Reset Email
          </Button>
        </form>
      </FormProvider>

      <Text color="white" textAlign="center" mt="1rem">
        Please check your email. If you have
        <br /> an account, you will have a link to
        <br /> reset your email. The link will
        <br /> expire in 24 hours!
      </Text>
    </Grid>
  );
};

export default ForgotPassword;
