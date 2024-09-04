/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Divider, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import axios from 'axios';
import { BankAccount, HeaderContainer } from 'component';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAccountPaymentId } from 'store';
import { getServerSideProps, notify } from 'utils';

export const DeleteAccountWrapper: FC<{ label: string }> = ({ label }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const bankCreditAndCryptoData = queryClient.getQueryData('bankCreditCardCrypto');
  const [radioValue, setRadioValue] = useState('');
  const [paymentData, setPaymentData] = useAccountPaymentId(({ paymentData, setPaymentData }) => [
    paymentData,
    setPaymentData,
  ]);
  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.delete(`${STAGING_URL}/web/wallet/remove-card`, {
        data: variable,
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        notify(`Successfully Remove`);
        void router.push('/purchase');
      },
      onError: ({ response }) => {
        notify(response.data.status.message, { status: 'error' });
      },
    }
  );

  return (
    <HeaderContainer label={label} route="/dashboard">
      <Box px="1rem" mb="1.5rem">
        <Text color="white" fontSize="2rem" mt="2rem">
          My Account
        </Text>

        <RadioGroup onChange={setRadioValue} value={radioValue}>
          {bankCreditAndCryptoData ? (
            <>
              {bankCreditAndCryptoData['bank'].map((item, index) => {
                const { accountNumber, nameOnAccount, bank_name } = item?.payment?.bankAccount;
                return (
                  <>
                    <Flex justifyContent="space-between" key={index}>
                      <Box mt="1rem">
                        <BankAccount
                          bankName={bank_name ?? ''}
                          name={nameOnAccount ?? ''}
                          accountNumber={accountNumber ?? ''}
                        />
                      </Box>
                      <Radio
                        value={`${index + 1}`}
                        colorScheme="teal"
                        onChange={(): void => {
                          setPaymentData({ paymentId: item.customerPaymentProfileId, paymentType: item.payment_type });
                        }}
                      />
                    </Flex>
                    <Divider mt="1rem" />
                  </>
                );
              })}
            </>
          ) : (
            <Text>No Record</Text>
          )}
        </RadioGroup>

        <Box textAlign="center">
          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt="2rem"
            w={350}
            h="3.25rem"
            isLoading={isLoading}
            onClick={(): void => {
              mutate({
                payment_profile_id: paymentData?.paymentId,
                payment_type: paymentData?.paymentType,
              } as any);
            }}
            isDisabled={!paymentData}
          >
            Delete Selected Account
          </Button>

          <Button
            borderRadius="1rem"
            mt="1rem"
            w={350}
            h="3.25rem"
            _active={{ bg: 'white' }}
            onClick={(): void => {
              void router.push('/purchase');
              setPaymentData(null);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </HeaderContainer>
  );
};

export { getServerSideProps };
