/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, chakra, Flex, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useVerification } from 'hooks';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useVerifyOtp } from 'store';

export const VerifyOtpForm: FC<{ email?: string; selected?: string; type?: string }> = ({ email, selected, type }) => {
  const method = useForm();
  const { handleSubmit, control } = method;
  const pinFields = new Array(6).fill(null);
  const { email: selectedEmail, type: selectedType } = useVerifyOtp();

  const [user, domain] = (email ?? selectedEmail ?? '').split('@');

  const { verify, resend, isVerifying } = useVerification({ selected });

  const onVerify = (val): void => {
    verify({
      email: email ?? selectedEmail,
      otp: val.pin,
      type: type ?? selectedType,
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
                    email: email ?? selectedEmail,
                    type: type ?? selectedType,
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
