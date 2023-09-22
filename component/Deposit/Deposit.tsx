import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  SlideFade,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import AddBankAccount from 'component/AddBankAccount/AddBankAccount';
import BankAccount from 'component/BankAccount/BankAccount';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_BAND_AND_CREDIT_CARD, options } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddBankIcons, DepositSuccessful, WithdrawSuccessful } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const Deposit: FC<{ label: string; url: string; url2: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const { data, isLoading: loading } = useQuery('bankAndCreditCard', FETCH_BAND_AND_CREDIT_CARD, errorHandler);
  const [amountValue, setAmountValue] = useState(0);

  const method = useForm();
  const { control, handleSubmit } = method;
  const [radioValue, setRadioValue] = useState('');
  const [successTrigger, setSuccessTrigger] = useState(false);

  const { mutate, isLoading } = useMutation(
    (variable) => axios.post(`${STAGING_URL}/${radioValue !== '2' ? url : url2}`, variable, options),
    {
      onSuccess: () => {
        if (label === 'Withdrawal') {
          notify(`Token Exchange for Wtihdrawal Successfully Initiated`);
          setSuccessTrigger(true);
        } else {
          notify(`Wallet Top Up Successfully Initiated`);
          setSuccessTrigger(true);
        }
      },
      onError: ({ response }) => {
        notify(`${response.data?.errors?.account_number}`, { status: 'error' });
      },
    }
  );

  const onDeposit = (val): void => {
    mutate(val);
  };

  return (
    <Box textAlign="center" overflow="hidden">
      {!successTrigger ? (
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onDeposit)}>
            <Controller
              control={control}
              name="amount"
              rules={{ required: 'Amount is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer label="Minimum Amount $20" errorMessage={error?.message ?? ''} place="end">
                  <TextField
                    type="number"
                    value={value || ''}
                    placeholder="Enter Amount"
                    onChange={(e): void => {
                      onChange(+e.target.value);
                      setAmountValue(+e.target.value);
                    }}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <RadioGroup onChange={setRadioValue} value={radioValue}>
              <Controller
                control={control}
                name="payment_profile_id"
                rules={{ required: radioValue === '1' ? 'Payment is required' : false }}
                render={({ field: { onChange, value }, fieldState: { error } }): ReactElement => {
                  return (
                    <FormControl isInvalid={!!error?.message}>
                      <Flex justifyContent="space-between">
                        <Box mt="1rem">
                          <BankAccount bankDetails={data?.[0]?.payment?.bankAccount} loading={loading} />
                          {error?.message && (
                            <SlideFade in={true} offsetY="-1rem">
                              <FormErrorMessage fontSize="0.9rem" color="error">
                                {error.message}
                              </FormErrorMessage>
                            </SlideFade>
                          )}
                        </Box>
                        <Radio
                          value={value}
                          colorScheme="teal"
                          onChange={(): void => onChange(data?.[0]?.defaultPaymentProfile)}
                        />
                      </Flex>
                    </FormControl>
                  );
                }}
              />

              <Divider mt="1rem" />

              <Flex my="1.5rem" justifyContent="space-between">
                <Flex>
                  <Image src={AddBankIcons} alt="Add Bank Icon" />

                  <Text ml="1rem" color="white" fontSize="1.25rem">
                    Add New Bank Account
                  </Text>
                </Flex>

                <Radio value="2" colorScheme="teal" />
              </Flex>
            </RadioGroup>

            {radioValue !== '2' ? <></> : <AddBankAccount />}

            <Divider mt="2rem" />

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
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir="column">
          <Box mt="14rem">
            <Image
              src={label === 'Withdrawal' ? WithdrawSuccessful : DepositSuccessful}
              width={100}
              height={100}
              alt="Withdrawal"
            />
          </Box>
          <Text color="white" fontSize="2rem">
            ${amountValue.toFixed(2)}
          </Text>
          <Text color="white" fontSize="20px">
            {label === 'Withdrawal' ? (
              <>
                Token Exchange for Wtihdrawal
                <br /> Successfully Initiated
              </>
            ) : (
              <>Wallet Top Up Successfully Initiated</>
            )}
          </Text>
          <Button
            variant="primary"
            borderRadius="1rem"
            mt="16rem"
            w={350}
            h="3.25rem"
            onClick={(): void => void router.push('/dashboard')}
          >
            Back Home
          </Button>
        </Flex>
      )}
    </Box>
  );
};
export default Deposit;
