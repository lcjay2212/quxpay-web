import { ArrowBackIcon, CheckIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import FinalStep from 'component/RegistrationForm/FinalStep';
import FirstStep from 'component/RegistrationForm/FirstStep';
import SecondStep from 'component/RegistrationForm/SecondStep';
import { post } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { notify } from 'utils/notify';

const Register: FC = () => {
  const method = useForm();
  const { handleSubmit } = method;
  const [step, setStep] = useState(1);
  const router = useRouter();

  const { mutate, isLoading } = useMutation((variable) => post('v/register', variable), {
    onSuccess: () => {
      notify(`User registration success!`);
      void router.push('/login');
    },
    onError: ({ response }) => {
      notify(`${response?.data?.message}`, { status: 'error' });
    },
  });

  const onSubmit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      setStep((e) => e + 1);
    }

    if (step === 3) {
      mutate(val);
    }
  };

  return (
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
              C<span style={{ color: 'white' }}>omplete Your Registration</span>
            </Text>
          </Flex>

          <Flex justifyContent="space-around" alignItems="center" my="1rem">
            <Flex>
              <LockIcon color="primary" w={50} h={50} />
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
          {step === 2 && <SecondStep />}
          {step === 3 && <FinalStep />}
          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt="1rem"
            w={350}
            h="3.25rem"
            isLoading={isLoading}
          >
            {step >= 3 ? 'Finish Registration' : 'Continuer Registration'}
          </Button>
        </form>
      </FormProvider>
    </Grid>
  );
};

export default Register;
