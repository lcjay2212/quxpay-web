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
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import AddBankAccount from 'component/AddBankAccount/AddBankAccount';
import BankAccount from 'component/BankAccount/BankAccount';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_BANK_AND_CREDIT_CARD } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddBankIcons, DepositSuccessful, QuxTokenIcon, WithdrawSuccessful } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const { data, isLoading: loading } = useQuery('bankAndCreditCard', FETCH_BANK_AND_CREDIT_CARD, errorHandler);
  const [amountValue, setAmountValue] = useState(0);

  const method = useForm({
    defaultValues: {
      payment_method: 'ach_bank',
    },
  });
  const { control, handleSubmit } = method;
  const [radioValue, setRadioValue] = useState('');
  const [successTrigger, setSuccessTrigger] = useState(false);
  const setPaymentId = useAccountPaymentId((e) => e.setPaymentId);

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/${radioValue !== `${data?.payments?.length + 1}` ? url : url2}`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: () => {
        if (label === 'Redeem') {
          setSuccessTrigger(true);
        } else {
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
    <Box textAlign="center" overflow="hidden" px="1rem">
      {!successTrigger ? (
        <>
          {!loading ? (
            <FormProvider {...method}>
              <form onSubmit={handleSubmit(onDeposit)}>
                <Flex flexDir="column" justifyContent="space-between">
                  <Box display="flex" flexDir="column">
                    <Controller
                      control={control}
                      name="amount"
                      rules={{ required: 'Amount is required' }}
                      render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                        <FormContainer
                          label={label === 'Purchase' ? `Minimum Amount $ 20` : 'max'}
                          errorMessage={error?.message ?? ''}
                          place="end"
                        >
                          <TextField
                            type="number"
                            value={value || ''}
                            placeholder="Enter Amount"
                            onChange={(e): void => {
                              onChange(+e.target.value);
                              setAmountValue(+e.target.value);
                            }}
                            onBlur={onBlur}
                            min={20}
                            max={label === 'Redeem' ? 100 : 9999}
                          />
                        </FormContainer>
                      )}
                    />

                    <RadioGroup onChange={setRadioValue} value={radioValue}>
                      <Controller
                        control={control}
                        name="payment_profile_id"
                        rules={{
                          required: radioValue !== `${data?.payments?.length + 1}` ? 'Payment is required' : false,
                        }}
                        render={({ field: { onChange }, fieldState: { error } }): ReactElement => {
                          return (
                            <FormControl isInvalid={!!error?.message}>
                              {data?.payments?.map((item, index) => (
                                <Flex justifyContent="space-between" key={index}>
                                  <Box mt="1rem">
                                    <BankAccount
                                      bankName={item?.bank_name}
                                      name={item?.account_name}
                                      accountNumber={item?.account_number}
                                      loading={loading}
                                    />
                                    {error?.message && (
                                      <SlideFade in={true} offsetY="-1rem">
                                        <FormErrorMessage fontSize="0.9rem" color="error">
                                          {error.message}
                                        </FormErrorMessage>
                                      </SlideFade>
                                    )}
                                  </Box>
                                  <Radio
                                    value={`${index + 1}`}
                                    colorScheme="teal"
                                    onChange={(): void => {
                                      onChange(item.payment_profile_id);
                                      setPaymentId(item.payment_profile_id);
                                    }}
                                  />
                                </Flex>
                              ))}
                            </FormControl>
                          );
                        }}
                      />

                      <Divider mt="1rem" />

                      {label === 'Purchase' && (
                        <>
                          <Flex my="1.5rem" justifyContent="space-between">
                            <Flex>
                              <Image src={AddBankIcons} alt="Add Bank Icon" />
                              <Text ml="1rem" color="white" fontSize="1.25rem">
                                Add New Bank Account
                              </Text>
                            </Flex>

                            <Radio value={`${data?.payments?.length + 1}`} colorScheme="teal" />
                          </Flex>
                          {radioValue !== `${data?.payments?.length + 1}` ? <></> : <AddBankAccount />}
                        </>
                      )}
                    </RadioGroup>

                    <Divider />
                  </Box>

                  <Box my="2rem">
                    <Button
                      type="submit"
                      variant="primary"
                      borderRadius="1rem"
                      w={350}
                      h="3.25rem"
                      isLoading={isLoading}
                    >
                      {label}
                    </Button>
                  </Box>
                </Flex>
              </form>
            </FormProvider>
          ) : (
            <Box height="500px" display="flex" justifyContent="center" alignItems="center">
              <Spinner size="xl" />
            </Box>
          )}
        </>
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir="column">
          <Box mt="14rem">
            <Image
              src={label === 'Redeem' ? WithdrawSuccessful : DepositSuccessful}
              width={100}
              height={100}
              placeholder="empty"
              alt="Redeem"
            />
          </Box>
          {label === 'Redeem' ? (
            <Text color="white" fontSize="2rem">
              $ {amountValue.toFixed(2)}
            </Text>
          ) : (
            <Flex>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image src={QuxTokenIcon} height={30} width={32} alt="Qux Logo" />
              </Box>
              <Text color="white" fontSize="2rem">
                {amountValue.toFixed(2)}
              </Text>
            </Flex>
          )}

          <Text color="white" fontSize="20px">
            {label === 'Redeem' ? (
              <>
                Redeeming Tokens
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
