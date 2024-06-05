import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import ApiIntegrationForm from 'component/ApiIntegrationForm';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_AUTHENTICATION } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

const BillerApiPage: FC = () => {
  // const { data, isLoading } = useQuery('notificationHistory', FETCH_NOTIFICATION_HISTORY, errorHandler);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { data, refetch, isLoading } = useQuery('authentication', FETCH_AUTHENTICATION);

  const { mutate } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/authentication/create?url=${data?.url}`, variable, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('QUX_PAY_USER_TOKEN')}`,
        },
      }),
    {
      // eslint-disable-next-line no-shadow
      onSuccess: () => {
        void refetch();
      },
    }
  );

  return (
    <HeaderContainer label="Biller API" route="/dashboard">
      <Box px="2.5rem">
        {step === 1 && (
          <>
            <Text color="primary" fontSize="2.5rem" fontWeight={400}>
              Biller Agreement
            </Text>
            <Text color="white" fontSize="18px" mt="1rem">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et
            </Text>
            <Flex flexDir="column" gap={4} mt="1rem">
              <Button variant="primary" borderRadius="1rem" h="3.25rem" onClick={(): void => setStep(step + 1)}>
                I Have Read The Terms and Agree
              </Button>
              <Button
                variant="secondary"
                borderRadius="1rem"
                h="3.25rem"
                onClick={(): void => void router.push('/dashboard')}
              >
                Cancel
              </Button>
            </Flex>
          </>
        )}
        {step === 2 && (
          <Flex flexDir="column" justifyContent="space-between" h="90vh">
            <Box color="white">
              <Box my="2rem">
                <Text mb="0.5rem">API Key:</Text>
                {!isLoading ? (
                  <Text>{!data?.app_key ? 'No API Passphrase' : data?.app_key}</Text>
                ) : (
                  <Spinner color="primary" />
                )}
              </Box>

              <Box my="2rem">
                <Text mb="0.5rem">API Passphrase:</Text>
                {!isLoading ? (
                  <Text>{!data?.secret ? 'No API Passphrase' : data?.secret}</Text>
                ) : (
                  <Spinner color="primary" />
                )}
              </Box>

              <Text color="primary" cursor="pointer" mt="3rem">
                Click here for API Documentation
              </Text>
              <Text color="primary" cursor="pointer" mt="3rem" onClick={(): void => setStep(step + 1)}>
                Submit Your API For Integration
              </Text>
            </Box>

            <Flex flexDir="column" gap={4} mt="1rem">
              <Button variant="primary" borderRadius="1rem" h="3.25rem" onClick={(): void => mutate()}>
                Generate New API Key & Passprase
              </Button>
              <Button
                variant="secondary"
                borderRadius="1rem"
                h="3.25rem"
                onClick={(): void => void router.push('/dashboard')}
              >
                Revoke API Key
              </Button>
            </Flex>
          </Flex>
        )}
        {step === 3 && <ApiIntegrationForm />}
      </Box>
    </HeaderContainer>
  );
};

export default BillerApiPage;
