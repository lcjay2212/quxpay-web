import { ArrowBackIcon, CheckIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { CaptchaModal, CorporationStep, FinalStep, FirstStep, PendingAccountModal, SecondStep } from 'component';
import { post } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HandsIcon, QuxLogo, QuxPayLogo, ShieldIcon } from 'public/assets';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { usePendingAccountModal } from 'store';
import { notify } from 'utils';

const Register: FC = () => {
  const method = useForm();
  const { handleSubmit } = method;
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const setVisible = usePendingAccountModal((e) => e.setVisible);

  const { mutate, isLoading } = useMutation((variable) => post('v/register', variable), {
    onSuccess: () => {
      notify(`User registration success!`);
      void router.push('/login');
    },
    onError: ({ response }) => {
      notify(`${response?.data?.message}`, { status: 'error' });
    },
  });

  const { mutate: corporationMutate, isLoading: loading } = useMutation(
    (variable) => post('web/purchaser-register', variable),
    {
      onSuccess: () => {
        setVisible(true);
        notify(`Corporation registration success!`);
      },
      onError: ({ response }) => {
        notify(`${response?.data?.message}`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => {
    const formData = new FormData();
    const birthdate = `${val.year}-${val.month}-${val.day}`;

    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      setStep((e) => e + 1);
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
        formData.append('date_of_birth', birthdate);
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
                <ArrowBackIcon color="white" mt="1.30rem" mr="1rem" cursor="pointer" onClick={(): void => setStep(1)} />
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
                <ArrowBackIcon color="white" mt="1.30rem" mr="1rem" cursor="pointer" onClick={(): void => setStep(2)} />
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
                isLoading={isLoading || loading}
              >
                {step >= 3 ? 'Finish Registration' : 'Continue Registration'}
              </Button>
            </form>
          </FormProvider>
        </Grid>
      </Box>

      <PendingAccountModal />
      <CaptchaModal />
    </>
  );
};

export default Register;
