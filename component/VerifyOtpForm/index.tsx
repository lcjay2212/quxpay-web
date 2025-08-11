/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, chakra, Flex, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useVerification } from 'hooks';
import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useVerifyOtp } from 'store';

const RESEND_COOLDOWN_SECONDS = 90;
const PIN_LENGTH = 6;

const useCountdownTimer = (
  initialSeconds: number
): {
  timeLeft: number;
  isActive: boolean;
  startTimer: () => void;
} => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
  }, [timeLeft, isActive]);

  const startTimer = useCallback((): void => {
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  return { timeLeft, isActive, startTimer };
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user[0]}${'*'.repeat(user.length - 1)}@${domain}`;
};

interface VerifyOtpFormProps {
  email?: string;
  selected?: string;
  type?: string;
}

export const VerifyOtpForm: FC<VerifyOtpFormProps> = ({ email, selected, type }) => {
  const method = useForm();
  const { handleSubmit, control } = method;
  const { email: selectedEmail, type: selectedType } = useVerifyOtp();
  const { verify, resend, isVerifying } = useVerification({ selected });

  const actualEmail = email ?? selectedEmail ?? '';
  const actualType = type ?? selectedType;

  const { timeLeft, isActive, startTimer } = useCountdownTimer(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const pinFields = Array.from({ length: PIN_LENGTH }, (_, index) => index);

  const handleVerify = useCallback(
    (values: { pin: string }): void => {
      verify({
        email: actualEmail,
        otp: values.pin,
        type: actualType,
      } as any);
    },
    [verify, actualEmail, actualType]
  );

  const handleResend = useCallback((): void => {
    resend({
      email: actualEmail,
      type: actualType,
    } as any);

    startTimer();
  }, [resend, actualEmail, actualType, startTimer]);

  const renderResendSection = (): ReactElement => {
    if (isActive) {
      return (
        <>
          Didn&apos;t get a code? Resend available in{' '}
          <chakra.span color="primary" fontWeight="bold">
            {formatTime(timeLeft)}
          </chakra.span>
        </>
      );
    }

    return (
      <>
        Didn&apos;t get a code?{' '}
        <chakra.span color="primary" as="u" cursor="pointer" onClick={handleResend}>
          Click to resend
        </chakra.span>
      </>
    );
  };

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(handleVerify)}>
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
              <br /> email to {maskEmail(actualEmail)}. Please enter it here.
            </Text>

            <Controller
              control={control}
              name="pin"
              render={({ field: { onChange } }): ReactElement => (
                <HStack justifyContent="center" my="2rem">
                  <PinInput size="lg" type="alphanumeric" onChange={onChange}>
                    {pinFields.map((index) => (
                      <PinInputField key={index} bg="white" />
                    ))}
                  </PinInput>
                </HStack>
              )}
            />

            <Text my="1rem" color="white" lineHeight="2rem" fontSize="18px">
              {renderResendSection()}
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
