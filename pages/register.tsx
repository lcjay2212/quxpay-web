/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowBackIcon, CheckIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Button, chakra, Flex, Grid, HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { CaptchaModal, CorporationStep, FinalStep, FirstStep, PendingAccountModal, SecondStep } from 'component';
import { post } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HandsIcon, QuxLogo, QuxPayLogo, ShieldIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useCaptchaModal, usePendingAccountModal } from 'store';
import { notify } from 'utils';

const Register: FC = () => {
  const method = useForm();
  const { handleSubmit, control, getValues } = method;
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const captchaModalVisible = useCaptchaModal((e) => e.visible);
  const [verification, setVerification] = useState(false);
  const pinFields = new Array(6).fill(null);

  const errorMessage = (res): void => {
    Object.keys(res).forEach((errorKey) => {
      notify(`${res[errorKey]}`, { status: 'error' });
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) => post('web/register', variable),
    onSuccess: () => {
      notify(`User registration success!`);
      setVerification(true);
    },
    onError: ({ response }: any) => {
      errorMessage(response?.data?.errors);
    },
  });

  const { mutate: corporationMutate, isPending: loading } = useMutation({
    mutationFn: (variable) => post('web/purchaser-register', variable),
    onSuccess: () => {
      notify(`Corporation registration success!`);
      setVerification(true);
    },
    onError: ({ response }: any) => {
      errorMessage(response?.data?.errors);
    },
  });

  const { mutate: validateMutation, isPending: isValidating } = useMutation({
    mutationFn: (variable) => post('web/validate', variable),
    onSuccess: () => {
      setStep((e) => e + 1);
    },
    onError: ({ response }: any) => {
      errorMessage(response?.data?.errors);
    },
  });

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: (variable) => post('web/otp/verify', variable),
    onSuccess: () => {
      notify('Verify OTP success');
      if (selected === 'regular') {
        void router.push('/login');
      } else {
        setVisible(true);
      }
    },
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message, { status: 'error' });
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

  const onSubmit = (val): void => {
    const formData = new FormData();
    const birthdate = `${val.year}-${val.month}-${val.day}`;

    if (step === 1) {
      validateMutation({ ...val, step, ...(selected === 'corporate' && { is_corporate: true }) });
      return;
    }

    if (step === 2) {
      validateMutation({ ...val, step, ...(selected === 'corporate' && { is_corporate: true }) });
      // setStep((e) => e + 1);
    }

    formData.append('email', val.email);
    formData.append('password', val.password);
    formData.append('password_confirmation', val.password_confirmation);
    formData.append('username', val.username);

    formData.append('address_2', val.address_2);
    formData.append('city', val.city);
    formData.append('state', val.state);
    formData.append('zip', val.zip);

    formData.append('account_name', val.account_name);
    formData.append('account_number', val.account_number);
    formData.append('routing_number', val.routing_number);
    formData.append('bank_name', val.bank_name);
    formData.append('ssn', val.ssn);

    if (step === 3) {
      if (selected === 'regular') {
        formData.append('firstname', val.firstname);
        formData.append('lastname', val.lastname);
        formData.append('billing_address', val.billing_address);
        formData.append('phone_number', val.phone_number);
        formData.append('dob', birthdate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutate(formData as any);
      } else {
        formData.append('role', selected);
        formData.append('mailing_address', val.mailing_address);
        formData.append('el_number', val.el_number);
        formData.append('corporation_name', val.corporation_name);
        formData.append('business_license', val.business_license);
        formData.append('contact_person_firstname', val.contact_person_firstname);
        formData.append('contact_person_lastname', val.contact_person_lastname);
        formData.append('contact_person_phone', val.contact_person_phone);
        formData.append('contact_person_email', val.contact_person_email);
        formData.append('dob', birthdate);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        corporationMutate(formData as any);
      }
    }
  };

  const onVerify = (val): void => {
    verify({
      otp: val.pin,
      email: getValues('email'),
      type: 'register',
    } as any);
  };

  return (
    <>
      <Box display={!selected ? 'block' : 'none'}>
        <Grid placeContent="center" h="100vh" gap="2" textAlign="center">
          <Box display="flex" justifyContent="center">
            <Image src={QuxLogo} height={35} width={100} alt="Qux Logo" />
          </Box>

          <Text color="primary" fontSize="3xl">
            W<span style={{ color: 'white' }}>allet</span>
          </Text>

          <Text color="white" fontSize={{ base: '1.5rem', md: '1.7rem' }} my="5rem">
            Are you a corporation or <br /> a regular user?
          </Text>

          <Flex flexDir="column" alignItems="center">
            <Button
              type="submit"
              variant="secondary"
              borderRadius="1rem"
              w={250}
              h="3.25rem"
              onClick={(): void => setSelected('regular')}
            >
              Regular User
            </Button>
            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              mt="1rem"
              w={250}
              h="3.25rem"
              onClick={(): void => setSelected('corporate')}
            >
              Corporation
            </Button>
          </Flex>
        </Grid>
      </Box>

      <Box display={!selected ? 'none' : 'block'}>
        {!verification ? (
          <Grid placeContent="center" h="auto" gap="2" my="3rem">
            <Box display="flex" justifyContent="center">
              <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
            </Box>

            {step === 1 && (
              <Flex justifyContent="space-between" alignItems="center" mt="2rem" mx="0.75rem">
                <Flex>
                  <ArrowBackIcon
                    color="white"
                    mt="1.30rem"
                    mr="1rem"
                    cursor="pointer"
                    onClick={(): void => void router.push('/')}
                  />
                  <Text color="primary" fontSize="4xl">
                    R<span style={{ color: 'white' }}>egister</span>
                  </Text>
                </Flex>
                <LockIcon color="white" w={30} h={30} />
              </Flex>
            )}
            {step === 2 && (
              <>
                <Flex mt="2rem">
                  <ArrowBackIcon
                    color="white"
                    mt="1.30rem"
                    mr="1rem"
                    cursor="pointer"
                    onClick={(): void => setStep(1)}
                  />
                  <Text color="primary" fontSize="4xl" w={300}>
                    C<span style={{ color: 'white' }}>ontinue Your Registration</span>
                  </Text>
                </Flex>

                <Flex justifyContent="space-around" alignItems="center" my="1rem">
                  <Flex>
                    <LockIcon color="primary" w={50} h={50} />
                    <CheckIcon color="primary" w={50} h={50} />
                  </Flex>
                  <Text color="white" fontSize="1.25rem">
                    Confirm Your Identity
                    <br /> to Protect Your Account
                  </Text>
                </Flex>
              </>
            )}
            {step === 3 && (
              <>
                <Flex mt="2rem">
                  <ArrowBackIcon
                    color="white"
                    mt="1.30rem"
                    mr="1rem"
                    cursor="pointer"
                    onClick={(): void => setStep(2)}
                  />
                  <Text color="primary" fontSize="4xl" w={300}>
                    C<span style={{ color: 'white' }}>ontinue Your Registration</span>
                  </Text>
                </Flex>

                <Flex justifyContent="space-around" alignItems="center" my="1rem">
                  <Flex flexDirection="column">
                    <Image src={ShieldIcon} height={45} width={45} alt="Shield" />
                    <Image src={HandsIcon} height={45} width={45} alt="Hands" />
                  </Flex>
                  <Text color="white" fontSize="1.25rem">
                    Securely enter your bank <br />
                    account information into our <br />
                    encrypted system
                  </Text>
                </Flex>
              </>
            )}

            <FormProvider {...method}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && <FirstStep />}
                {step === 2 && <>{selected === 'regular' ? <SecondStep /> : <CorporationStep />}</>}
                {step === 3 && <FinalStep />}
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  mt="1rem"
                  w={350}
                  h="3.25rem"
                  isLoading={isPending || loading || isValidating}
                >
                  {step >= 3 ? 'Finish Registration' : 'Continue Registration'}
                </Button>
              </form>
              {captchaModalVisible && <CaptchaModal label="login" />}
            </FormProvider>
          </Grid>
        ) : (
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onVerify)}>
              <Flex m="2rem" height="90vh" flexDirection="column" justifyContent="space-between">
                <Box>
                  <Text color="primary" fontSize="3xl" w={300}>
                    2<span style={{ color: 'white' }}>-steps verification</span>
                  </Text>
                  <Text my="1rem" color="white" lineHeight="2rem" fontSize="18px">
                    We have sent a verification code via
                    <br /> email to {getValues('email')}. Please enter it here.
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
                          email: getValues('email'),
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
                    w={350}
                    h="3.25rem"
                    isLoading={isVerifying}
                  >
                    Submit
                  </Button>
                </Box>
              </Flex>
            </form>
          </FormProvider>
        )}
      </Box>

      <PendingAccountModal />
    </>
  );
};

export default Register;
