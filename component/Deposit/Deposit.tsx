/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import AddBankAccount from 'component/AddBankAccount/AddBankAccount';
import AddCreditCardForm from 'component/AddCreditCardForm/AddCreditCardForm';
import AddCrytoWallet from 'component/AddCrytoWallet/AddCrytoWallet';
import BankAccount from 'component/BankAccount/BankAccount';
import CashInCrypto from 'component/CashInCrypto/CashInCrypto';
import CryptoWallet from 'component/CryptoWallet/CryptoWallet';
import { FormContainer } from 'component/FormInput';
import { Label } from 'component/PaidPosInfoById';
import { TextField } from 'component/TextField';
import { FETCH_BANK_CREDIT_CARD_CRYPTO } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddBankIconTwo, AddCreditCardIcon, AddCryptoIcon, QuxTokenIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import { useCongratulationContent } from 'store/useCongratulationContent';
import { useCryptoPaymentData } from 'store/useCryptoPaymentData';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

export const calculateThreePercent = (amount: number): number => amount * 0.03;
export const calculateFivePercent = (amount: number): number => amount * 0.05;

const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const { data, isLoading: loading } = useQuery('bankCreditCardCrypto', FETCH_BANK_CREDIT_CARD_CRYPTO, errorHandler);
  const [type, setType] = useState<'BANK' | 'CREDIT' | 'CRYPTO' | 'ADD_CRYPTO' | 'ADD_BANK' | undefined>(undefined);
  const method = useForm();
  const { control, handleSubmit, watch } = method;
  const setVisible = useCongratulationContent((e) => e.setVisible);
  const setPaymentId = useAccountPaymentId((e) => e.setPaymentId);
  const [step, setStep] = useState(1);
  const [selectedBankDetails, setSelectedBankDetails] = useState<{
    payment: { bankAccount: { bank_name?: string; nameOnAccount?: string } };
  }>();
  const [selectedCrypto, setSelectedCrypto] = useState<{
    address?: string;
    currency?: string;
    id?: number;
    name?: string;
  }>();

  const cryptoPaymentData = useCryptoPaymentData((e) => e.cryptoPaymentData);

  const amount = watch('amount');

  const { setAmount, setCongratsType } = useCongratulationContent((e) => ({
    setAmount: e.setAmount,
    setCongratsType: e.setType,
  }));

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(
        `${STAGING_URL}/${type === 'BANK' ? url : type !== 'CREDIT' ? url2 : 'web/wallet/add-credit-card'}`,
        variable,
        {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
            Version: 2,
          },
        }
      ),
    {
      onSuccess: () => {
        setVisible(true);
        setAmount(amount);
        setCongratsType(type);
      },
      onError: ({ response }) => {
        const { errors, data } = response?.data || {};
        const errorMsg = errors?.account_number;
        const creditErrorMsg = data?.message || 'Failed to Purchase using credit card';
        const cryptoErrorMsg = data?.errors?.address || data?.message;

        notify(type === 'CREDIT' ? creditErrorMsg : type === 'CRYPTO' ? cryptoErrorMsg : errorMsg, { status: 'error' });
      },
    }
  );

  const { mutate: addCrypto, isLoading: addCryptoLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/crypto/create-wallet`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        setStep((e) => e + 1);
      },
      onError: () => {
        notify(`Failed to create Crypto Wallet`, { status: 'error' });
      },
    }
  );

  const { mutate: completeCryptoPayment, isLoading: paymentLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/crypto/complete-transaction`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        setVisible(true);
        setAmount(amount);
        setCongratsType(type);
      },
      onError: () => {
        notify(`Failed to create Crypto Wallet`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => {
    if (step === 1) {
      if (type === 'ADD_CRYPTO') {
        addCrypto({ address: val.address, name: val.name, currency: val.currency } as any);
        return;
      }

      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      if (label === 'Purchase') {
        if (type === 'CREDIT') {
          mutate({
            ...val,
            card_holder_name: `${val.firstname} ${val.lastname}`,
            address2: val.address2 || '',
          } as any);
          return;
        }

        if (type === 'CRYPTO') {
          completeCryptoPayment({
            payment_id: cryptoPaymentData?.payment_id,
            pos_id: cryptoPaymentData?.pos_id,
            currency: cryptoPaymentData?.currency,
            address: cryptoPaymentData?.address,
            type: 'purchase',
          } as any);
        } else {
          mutate({ ...val, payment_method: 'ach_bank' });
        }
      } else if (label === 'Redeem') {
        mutate({
          ...val,
          ...(type === 'ADD_CRYPTO' || type === 'CRYPTO' ? { amount, address: selectedCrypto?.address } : {}),
        });
      }
    }
  };
  return (
    <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
      {!loading ? (
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDir="column" justifyContent="space-between" minH="90vh" h="auto">
              {step === 1 && (
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
                          }}
                          onBlur={onBlur}
                          max={label === 'Redeem' ? 100 : 9999}
                          formNoValidate
                        />
                      </FormContainer>
                    )}
                  />

                  <RadioGroup>
                    <Controller
                      control={control}
                      name="payment_profile_id"
                      rules={{
                        required: !type ? 'Payment is required' : false,
                      }}
                      render={({ field: { onChange }, fieldState: { error } }): ReactElement => {
                        return (
                          <>
                            {label === 'Redeem' && (
                              <Text color="white" textAlign="start" fontWeight="bold" fontSize="2rem">
                                To My Bank
                              </Text>
                            )}
                            <FormControl isInvalid={!!error?.message}>
                              {data?.bank?.length ? (
                                data?.bank?.map((item, index) => {
                                  const { accountNumber, nameOnAccount, bank_name } = item?.payment?.bankAccount;
                                  return (
                                    <Flex justifyContent="space-between" key={index}>
                                      <Box mt="1rem">
                                        <BankAccount
                                          bankName={bank_name ?? ''}
                                          name={nameOnAccount ?? ''}
                                          accountNumber={accountNumber ?? ''}
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
                                          onChange(item.customerPaymentProfileId);
                                          setPaymentId(item.customerPaymentProfileId);
                                          setSelectedBankDetails(item);
                                          setType('BANK');
                                        }}
                                      />
                                    </Flex>
                                  );
                                })
                              ) : (
                                <Text>No Bank Record</Text>
                              )}
                            </FormControl>
                          </>
                        );
                      }}
                    />

                    <Divider mt="1rem" />

                    {label === 'Redeem' && (
                      <>
                        <Controller
                          control={control}
                          name="currency"
                          rules={{
                            required: type === 'CRYPTO' ? 'Payment is required' : false,
                          }}
                          render={({ field: { onChange }, fieldState: { error } }): ReactElement => {
                            return (
                              <>
                                <Text color="white" textAlign="start" fontWeight="bold" fontSize="2rem" my="1rem">
                                  To Crypto
                                </Text>
                                <FormControl isInvalid={!!error?.message}>
                                  {data?.crypto?.length ? (
                                    data?.crypto?.map((item, index) => (
                                      <Flex justifyContent="space-between" key={index}>
                                        <Box mt="1rem">
                                          <CryptoWallet
                                            address={item.address ?? ''}
                                            name={item.name ?? ''}
                                            type={item.currency ?? ''}
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
                                          value={`${item.address}`}
                                          colorScheme="teal"
                                          onChange={(): void => {
                                            onChange(item.currency);
                                            setSelectedCrypto(item);
                                            setType('CRYPTO');
                                          }}
                                        />
                                      </Flex>
                                    ))
                                  ) : (
                                    <Text textAlign="start">No Crypto Record</Text>
                                  )}
                                </FormControl>
                              </>
                            );
                          }}
                        />

                        <Divider mt="1rem" />
                      </>
                    )}

                    {label === 'Redeem' && (
                      <>
                        <Flex my="1.5rem" justifyContent="space-between">
                          <Flex alignItems="center">
                            <Image src={AddCryptoIcon} height={50} width={60} alt="Add Bank Icon" />
                            <Text ml="1rem" color="white" fontSize="1.25rem">
                              Add New Crypto Wallet
                            </Text>
                          </Flex>

                          <Radio
                            value={`${data?.payments?.length + 1}`}
                            onChange={(): void => setType('ADD_CRYPTO')}
                            colorScheme="teal"
                          />
                        </Flex>
                        {type === 'ADD_CRYPTO' && <AddCrytoWallet />}

                        <Divider mt="1rem" />
                      </>
                    )}

                    {label === 'Purchase' && (
                      <>
                        <Flex my="1.5rem" justifyContent="space-between">
                          <Flex alignItems="center">
                            <Image src={AddBankIconTwo} height={50} width={60} alt="Add Bank Icon" />
                            <Text ml="1rem" color="white" fontSize="1.25rem">
                              Add New Bank Account
                            </Text>
                          </Flex>

                          <Radio
                            value={`${data?.bank?.length + 1}`}
                            onChange={(): void => setType('ADD_BANK')}
                            colorScheme="teal"
                          />
                        </Flex>
                        {type === 'BANK' && <AddBankAccount />}
                        <Divider mt="1rem" />

                        <Flex my="1.5rem" justifyContent="space-between">
                          <Flex alignItems="center">
                            <Image src={AddCreditCardIcon} height={50} width={60} alt="Add Bank Icon" />
                            <Text ml="1rem" color="white" fontSize="1.25rem">
                              Add New Credit Card
                            </Text>
                          </Flex>

                          <Radio
                            value={`${data?.bank?.length + 2}`}
                            onChange={(): void => setType('CREDIT')}
                            colorScheme="teal"
                          />
                        </Flex>
                        {type === 'CREDIT' && <AddCreditCardForm />}
                        <Divider mt="1rem" />

                        <Flex my="1.5rem" justifyContent="space-between">
                          <Flex alignItems="center">
                            <Image src={AddCryptoIcon} height={50} width={60} alt="Add Bank Icon" />
                            <Text ml="1rem" color="white" fontSize="1.25rem">
                              Cash In Crypto
                            </Text>
                          </Flex>

                          <Radio
                            value={`${data?.bank?.length + 3}`}
                            onChange={(): void => setType('CRYPTO')}
                            colorScheme="teal"
                          />
                        </Flex>
                        {type === 'CRYPTO' && <CashInCrypto />}
                      </>
                    )}
                  </RadioGroup>

                  <Divider />
                </Box>
              )}
              {step === 2 && (
                <Box color="white" m="2rem">
                  {label === 'Purchase' && type === 'CRYPTO' && (
                    <Box mb="2rem" textAlign="start">
                      <Text noOfLines={1}>Received ${amount?.toFixed(2)} in tokens</Text>
                      <Text>From: {cryptoPaymentData?.address}</Text>
                    </Box>
                  )}

                  {label === 'Redeem' && (
                    <Box mb="2rem" textAlign="start">
                      {type === 'BANK' && (
                        <>
                          <Text noOfLines={1}>From: {selectedBankDetails?.payment.bankAccount.bank_name}</Text>
                          <Text>Name: {selectedBankDetails?.payment.bankAccount.nameOnAccount}</Text>
                        </>
                      )}
                      {(type === 'ADD_CRYPTO' || type === 'CRYPTO') && (
                        <>
                          <Text noOfLines={1}>
                            Sending ${(amount + calculateFivePercent(amount)).toFixed(2)} in tokens
                          </Text>
                          <Text>To: {type === 'CRYPTO' && selectedCrypto?.address}</Text>
                        </>
                      )}
                    </Box>
                  )}

                  <Label label={`${label} Amount:`} image={QuxTokenIcon} amount={amount || 0.0} loading={loading} />
                  <Label
                    label="Token Fee"
                    image={QuxTokenIcon}
                    amount={(label === 'Redeem' ? calculateFivePercent(amount) : calculateThreePercent(amount)) || 0.0}
                    loading={loading}
                  />
                  <Label
                    label="Total Purchase amount:"
                    image={QuxTokenIcon}
                    amount={
                      (label === 'Redeem'
                        ? amount + calculateFivePercent(amount)
                        : amount + calculateThreePercent(amount)) || 0.0
                    }
                    loading={loading}
                  />

                  {label === 'Purchase' && type === 'CRYPTO' && (
                    <Text my="1.5rem" color="gray" textAlign="start" fontSize="18px">
                      Please go back to the purchase screen to generate a new wallet address if you wish to send more.
                    </Text>
                  )}

                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value, onBlur } }): ReactElement => (
                      <Box mt="1rem">
                        <FormContainer label="Comment">
                          <Textarea
                            value={value || ''}
                            placeholder="Comment (Optional)"
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        </FormContainer>
                      </Box>
                    )}
                  />
                </Box>
              )}

              <Box mt="2rem">
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  w="400px"
                  h="3.25rem"
                  isLoading={isLoading || addCryptoLoading || paymentLoading}
                >
                  {step === 1
                    ? label === 'Purchase' && type === 'CRYPTO'
                      ? 'Tokens Received!'
                      : label
                    : label === 'Redeem'
                    ? type === 'BANK'
                      ? 'Initiate Bank Redeem'
                      : 'Confirm Crypto Redeem'
                    : type === 'ADD_CRYPTO'
                    ? 'Complete - Return to Home'
                    : `Confirm ${label}`}
                </Button>

                {step === 2 && (
                  <Button
                    variant="secondary"
                    borderRadius="1rem"
                    w="400px"
                    h="3.25rem"
                    isLoading={isLoading}
                    mt="1rem"
                    onClick={(): void => void router.push('dashboard')}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Flex>
          </form>
        </FormProvider>
      ) : (
        <Box height="500px" display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Box>
      )}
    </Box>
  );
};
export default Deposit;
