import { Box, Button, Flex, FormControl, FormErrorMessage, Radio, SlideFade } from '@chakra-ui/react';
import axios from 'axios';
import BankAccount from 'component/BankAccount/BankAccount';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_BAND_AND_CREDIT_CARD, options } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const Deposit: FC<{ label: string; url: string }> = ({ label, url }) => {
  const method = useForm();
  const { data, isLoading: loading } = useQuery('bankAndCreditCard', FETCH_BAND_AND_CREDIT_CARD, errorHandler);
  const { control, handleSubmit } = method;

  const { mutate, isLoading } = useMutation((variable) => axios.post(`${STAGING_URL}/${url}`, variable, options), {
    // eslint-disable-next-line no-console
    onSuccess: () => {
      if (label === 'Withdrawal') {
        notify(`Token Exchange for Wtihdrawal Successfully Initiated`);
      } else {
        notify(`Wallet Top Up Successfully Initiated`);
      }
    },
    onError: ({ response }) => {
      notify(`${response.data?.errors?.account_number}`, { status: 'error' });
    },
  });

  const onDeposit = (val): void => {
    mutate(val);
  };

  return (
    <Box textAlign="center" overflow="hidden">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onDeposit)}>
          <Controller
            control={control}
            name="amount"
            rules={{ required: 'Username is required' }}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
              <FormContainer label="Minimum Amount $20" errorMessage={error?.message ?? ''} place="end">
                <TextField
                  type="number"
                  value={value ?? ''}
                  placeholder="Enter Amount"
                  onChange={(e): void => onChange(+e.target.value)}
                  onBlur={onBlur}
                />
              </FormContainer>
            )}
          />

          <Controller
            control={control}
            name="payment_profile_id"
            rules={{ required: 'Payment is required' }}
            render={({
              field: { onChange, value = data?.[1]?.defaultPaymentProfile },
              fieldState: { error },
            }): ReactElement => (
              <FormControl isInvalid={!!error?.message}>
                <Flex justifyContent="space-between">
                  <Box mt="1rem">
                    <BankAccount bankDetails={data?.[1]?.payment?.bankAccount} loading={loading} />
                    {error?.message && (
                      <SlideFade in={true} offsetY="-1rem">
                        <FormErrorMessage fontSize="0.9rem" color="error">
                          {error.message}
                        </FormErrorMessage>
                      </SlideFade>
                    )}
                  </Box>
                  <Radio value={value ?? data?.[1]?.defaultPaymentProfile} onChange={onChange} colorScheme="teal" />
                </Flex>
              </FormControl>
            )}
          />

          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt={{ base: label === 'Withdrawal' ? '32rem' : '1rem', md: '2rem' }}
            w={350}
            h="3.25rem"
            isLoading={isLoading}
          >
            {label}
          </Button>
        </form>
      </FormProvider>
    </Box>
  );
};
export default Deposit;
