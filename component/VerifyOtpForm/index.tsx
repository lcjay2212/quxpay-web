/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, chakra, Flex, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { post } from 'constants/api';
import storage from 'constants/storage';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { usePendingAccountModal, usePendingBankAccountVerificationModal, useUser } from 'store';
import { notify } from 'utils';

export const VerifyOtpForm: FC<{ email?: string; selected?: string }> = ({ email, selected }) => {
  const router = useRouter();
  const method = useForm();
  const { handleSubmit, control } = method;
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const pinFields = new Array(6).fill(null);
  const setUser = useUser((e) => e.setUser);
  const setVerificationVisible = usePendingBankAccountVerificationModal(({ setVisible }) => setVisible);
  const [user, domain] = (email ?? '').split('@');

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: (variable) => post('web/otp/verify', variable),
    onSuccess: ({ data }: any) => {
      notify('Verify OTP success');
      if (selected === undefined || selected === 'regular') {
        sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
        sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
        setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));
        setVerificationVisible(true);
        void router.push('/dashboard');
      } else {
        setVisible(true);
      }
    },
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message || response?.data?.errors?.otp, { status: 'error' });
    },
  });

  const { mutate: resend } = useMutation({
    mutationFn: (variable) => post('web/otp/resend', variable),
    onSuccess: () => {
      notify('Resend login OTP success');
    },
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message, { status: 'error' });
    },
  });

  const onVerify = (val): void => {
    verify({
      email,
      otp: val.pin,
      type: 'register',
    } as any);
  };

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onVerify)}>
        <Flex
          mx={{ base: '2rem', md: 'auto' }}
          my="2rem"
          height="90vh"
          w={{ base: 'auto', md: '400px' }}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Text color="primary" fontSize="3xl" w={300}>
              2<span style={{ color: 'white' }}>-steps verification</span>
            </Text>
            <Text my="1rem" color="white" lineHeight="2rem" fontSize="18px">
              We have sent a verification code via
              <br /> email to {user[0] + '*'.repeat(user.length - 1) + '@' + domain}. Please enter it here.
            </Text>

            <Controller
              control={control}
              name="pin"
              render={({ field: { onChange } }): ReactElement => (
                <HStack justifyContent="center" my="2rem">
                  <PinInput size="lg" type="alphanumeric" onChange={onChange}>
                    {pinFields.map((_, index) => (
                      <PinInputField key={index} bg="white" />
                    ))}
                  </PinInput>
                </HStack>
              )}
            />

            <Text my="1rem" color="white" lineHeight="2rem" fontSize="18px">
              Didn&apos;t get a code?{' '}
              <chakra.span
                color="primary"
                as="u"
                cursor="pointer"
                onClick={(): void => {
                  resend({
                    email,
                    type: 'register',
                  } as any);
                }}
              >
                Click to resend
              </chakra.span>
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              mt="1rem"
              w={300}
              h="3.25rem"
              isLoading={isVerifying}
            >
              Submit
            </Button>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};
