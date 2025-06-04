/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowBackIcon, CheckIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { CaptchaModal, CorporationStep, FinalStep, FirstStep, PendingAccountModal, SecondStep } from 'component';
import { VerifyOtpForm } from 'component/VerifyOtpForm';
import { post } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useCaptchaModal } from 'store';
import { notify } from 'utils';

const Register: FC = () => {
  const method = useForm();
  const { handleSubmit, getValues } = method;
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const captchaModalVisible = useCaptchaModal((e) => e.visible);
  const [verification, setVerification] = useState(false);

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

  const onSubmit = (val): void => {
    const formData = new FormData();
    const birthdate = `${val.year}-${val.month}-${val.day}`;

    if (step === 1) {
      validateMutation({ ...val, step, ...(selected === 'corporate' && { is_corporate: true }) });
      return;
    }

    if (step === 2) {
      validateMutation({ ...val, step, ...(selected === 'corporate' && { is_corporate: true }) });
    }

    [
      'email',
      'password',
      'password_confirmation',
      'username',
      'address_2',
      'city',
      'state',
      'zip',
      // 'account_name',
      // 'account_number',
      // 'routing_number',
      // 'bank_name',
      'ssn',
    ].forEach((field) => formData.append(field, val[field]));

    if (step === 3) {
      const fields =
        selected === 'regular'
          ? ['firstname', 'lastname', 'billing_address', 'phone_number']
          : [
              'mailing_address',
              'el_number',
              'corporation_name',
              'business_license',
              'contact_person_firstname',
              'contact_person_lastname',
              'contact_person_phone',
              'contact_person_email',
            ];

      if (selected !== 'regular') {
        formData.append('passport', val?.passport[0]);
        formData.append('driver_license', val?.driver_license[0]);
      }

      fields.forEach((field) => formData.append(field, val[field]));
      formData.append('dob', birthdate);
      formData.append('role', selected);

      (selected === 'regular' ? mutate : corporationMutate)(formData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  };

  return (
    <>
      <Box display={!selected ? 'block' : 'none'}>
        <Grid placeContent="center" h="100vh" gap="2" textAlign="center">
          <Box display="flex" justifyContent="center">
            <Image src="/assets/images/qux-logo.webp" height={35} width={100} alt="Qux Logo" />
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
              <Image src="/assets/images/qux-pay-logo.webp" height={70} width={135} alt="Qux Logo" />
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
                    <Image src="/assets/icons/shield.webp" height={45} width={45} alt="Shield" />
                    <Image src="/assets/icons/awesome-hands.webp" height={45} width={45} alt="Hands" />
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
                {step === 3 && <FinalStep type={selected} />}
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
          <VerifyOtpForm email={getValues('email')} selected={selected} type="register" />
        )}
      </Box>

      <PendingAccountModal />
    </>
  );
};

export default Register;
