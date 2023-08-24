import { CheckIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Button, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import FinalStep from 'component/RegistrationForm/FinalStep';
import FirstStep from 'component/RegistrationForm/FirstStep';
import SecondStep from 'component/RegistrationForm/SecondStep';
import Image from 'next/image';
import { QuxPayLogo } from 'public/assets';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const Register: FC = () => {
  const method = useForm();
  const { handleSubmit } = method;
  const [step, setStep] = useState(1);

  const onSubmit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      setStep((e) => e + 1);
    }

    if (step === 3) {
      // eslint-disable-next-line no-console
      console.log(val);
    }
  };

  return (
    <Grid placeContent="center" h="auto" gap="2" my="3rem">
      <Box display="flex" justifyContent="center">
        <Image src={QuxPayLogo} height={70} width={135} alt="Qux Logo" />
      </Box>

      {step === 1 && (
        <Flex justifyContent="space-between" alignItems="center" mt="2rem" mx="0.75rem">
          <Text color="primary" fontSize="4xl">
            R<chakra.span color="white">egister</chakra.span>
          </Text>
          <LockIcon color="white" w={30} h={30} />
        </Flex>
      )}
      {step === 2 && (
        <>
          <Text color="primary" fontSize="4xl" w={300} mt="2rem" ml="0.75rem">
            C<chakra.span color="white">ontinue Your Registration</chakra.span>
          </Text>

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
          <Text color="primary" fontSize="4xl" w={300} mt="2rem" ml="0.75rem">
            C<chakra.span color="white">omplete Your Registration</chakra.span>
          </Text>

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
          <Button type="submit" variant="primary" borderRadius="1rem" mt="1rem" w={350} h="3.25rem">
            {step >= 3 ? 'Finish Registration' : 'Continuer Registration'}
          </Button>
        </form>
      </FormProvider>
    </Grid>
  );
};

export default Register;
