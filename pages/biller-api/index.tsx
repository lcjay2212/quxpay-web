import { Box, Button, Flex, Spinner, Text, chakra } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiIntegrationForm, HeaderContainer } from 'component';
import { FETCH_AUTHENTICATION } from 'constants/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

const BillerApiPage: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { data, refetch, isLoading } = useQuery({ queryKey: ['authentication'], queryFn: FETCH_AUTHENTICATION });

  const { mutate } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/authentication/create?url=${data?.url}`, variable, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('QUX_PAY_USER_TOKEN')}`,
        },
      }),
    onSuccess: () => {
      void refetch();
    },
  });

  const { mutate: downloadPlugin } = useMutation({
    mutationFn: () =>
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/quxpay`, {
        headers: {
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      window.open(data?.data?.obfuscate_version);
    },
  });

  return (
    <HeaderContainer label="Biller API" route="/dashboard">
      <Box px="2.5rem">
        {step === 1 && (
          <>
            <Text color="primary" fontSize="2.5rem" fontWeight={400}>
              Biller Agreement
            </Text>
            <Text color="white" fontSize="18px" mt="1rem">
              Becoming a biller using QUX Pay® means being able to integrate QUX Pay® into your sales process in two
              easy-to-use ways.
              <br />
              <br />
              First, you can use our API with any custom website so that you can accept QUX Pay® eTokens® as a payment
              process. It’s very similar to other integrations out there (which means it’s quick to integrate) and
              you’ll also gain access to our documentation.
              <br />
              <br />
              Second, you’ll have access to our Wordpress WooCommerce Plugin which can be downloaded and installed in
              any current version of Wordpress. This also comes with documentation.
              <br />
              <br />
              By clicking agree, you accept the QUX® Merchant{' '}
              <a href="https://qux.tv/terms-and-condition" target="_blank" rel="noreferrer">
                <chakra.span
                  _hover={{
                    color: 'primary',
                  }}
                >
                  Terms and Conditions
                </chakra.span>
              </a>{' '}
              and{' '}
              <span>
                <a href="https://qux.tv/privacy-policy" target="_blank" rel="noreferrer">
                  <chakra.span
                    _hover={{
                      color: 'primary',
                    }}
                  >
                    Privacy Policy.
                  </chakra.span>
                </a>
              </span>
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
              <Link href="https://blog.quxpay.com/wordpress">
                <Text color="primary" cursor="pointer" mt="3rem">
                  Click here for API Documentation
                </Text>
              </Link>
              <Text color="primary" cursor="pointer" mt="3rem" onClick={(): void => setStep(step + 1)}>
                Submit Your API For Integration
              </Text>

              <Text color="primary" cursor="pointer" mt="3rem">
                View the Wordpress WooCommerce Plugin Documentation
              </Text>

              <Text color="primary" cursor="pointer" mt="3rem" onClick={(): void => downloadPlugin()}>
                Click here to Download the Wordpress WooCommerce Plugin
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
