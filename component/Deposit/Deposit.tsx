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
import {
  AddBankIconTwo,
  AddCreditCardIcon,
  CryptoIcon,
  DepositSuccessful,
  QuxTokenIcon,
  WithdrawSuccessful,
} from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

export const calculateThreePercent = (amount: number): number => amount * 0.03;
export const calculateFivePercent = (amount: number): number => amount * 0.05;

const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const { data, isLoading: loading } = useQuery('bankCreditCardCrypto', FETCH_BANK_CREDIT_CARD_CRYPTO, errorHandler);
  const method = useForm();
  const { control, handleSubmit, watch } = method;
  const [successTrigger, setSuccessTrigger] = useState(false);
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

  const [type, setType] = useState<'BANK' | 'CREDIT' | 'CRYPTO' | 'ADD_CRYPTO' | undefined>(undefined);
  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/${!type ? url : url2}`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        setSuccessTrigger(true);
      },
      onError: ({ response }) => {
        notify(`${response.data?.errors?.account_number}`, { status: 'error' });
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
      onError: () => {
        notify(`Failed to create Crypto Wallet`, { status: 'error' });
      },
    }
  );

  const amount = watch('amount');

  const onDeposit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);

      if (type === 'ADD_CRYPTO') {
        addCrypto({
          address: val.address,
          name: val.name,
          currency: val.currency,
        } as any);
      }
      return;
    }

    if (step === 2) {
      if (type === 'ADD_CRYPTO' || type === 'CRYPTO') {
        mutate({ ...val, amount });
      } else {
        mutate({ ...val, payment_method: 'ach_bank' });
      }
    }
  };
  return (
    <Box textAlign="center" overflow="hidden" px="1rem">
      {!successTrigger ? (
        <>
          {!loading ? (
            <FormProvider {...method}>
              <form onSubmit={handleSubmit(onDeposit)}>
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
                                              setType(undefined);
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
                                              value={index}
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
                                <Image src={CryptoIcon} height={50} width={60} alt="Add Bank Icon" />
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
                                value={`${data?.payments?.length + 1}`}
                                onChange={(): void => setType('BANK')}
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
                                value={`${data?.payments?.length + 2}`}
                                onChange={(): void => setType('CREDIT')}
                                colorScheme="teal"
                              />
                            </Flex>
                            {type === 'CREDIT' && <AddCreditCardForm />}
                            <Divider mt="1rem" />

                            <Flex my="1.5rem" justifyContent="space-between">
                              <Flex alignItems="center">
                                <Image src={CryptoIcon} height={50} width={60} alt="Add Bank Icon" />
                                <Text ml="1rem" color="white" fontSize="1.25rem">
                                  Cash In Crypto
                                </Text>
                              </Flex>

                              <Radio
                                value={`${data?.payments?.length + 3}`}
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
                          <Text>From: rDsbeomae4FXwgQTJp9Rs64Q g9vDiTCdBv.</Text>
                        </Box>
                      )}

                      {type === 'BANK' && (
                        <Box mb="2rem" textAlign="start">
                          <Text noOfLines={1}>From: {selectedBankDetails?.payment.bankAccount.bank_name}</Text>
                          <Text>Name: {selectedBankDetails?.payment.bankAccount.nameOnAccount}</Text>
                        </Box>
                      )}

                      {label === 'Redeem' && type === 'ADD_CRYPTO' && (
                        <Box mb="2rem" textAlign="start">
                          <Text noOfLines={1}>
                            Sending ${(amount + calculateFivePercent(amount)).toFixed(2)} in tokens
                          </Text>
                          <Text>To: </Text>
                        </Box>
                      )}

                      {label === 'Redeem' && type === 'CRYPTO' && (
                        <Box mb="2rem" textAlign="start">
                          <Text noOfLines={1}>
                            Sending ${(amount + calculateFivePercent(amount)).toFixed(2)} in tokens
                          </Text>
                          <Text>To: {selectedCrypto?.address}</Text>
                        </Box>
                      )}

                      <Label label={`${label} Amount:`} image={QuxTokenIcon} amount={amount || 0.0} loading={loading} />
                      <Label
                        label="Token Fee"
                        image={QuxTokenIcon}
                        amount={
                          (label === 'Redeem' ? calculateFivePercent(amount) : calculateThreePercent(amount)) || 0.0
                        }
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
                          Please go back to the purchase screen to generate a new wallet address if you wish to send
                          more.
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
                      isLoading={isLoading && addCryptoLoading}
                    >
                      {step === 1 ? label : `Confirm ${label}`}
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
              $ {(amount + calculateThreePercent(amount)).toFixed(2)}
            </Text>
          ) : (
            <Flex>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image src={QuxTokenIcon} height={30} width={32} alt="Qux Logo" />
              </Box>
              <Text color="white" fontSize="2rem">
                {(amount + calculateThreePercent(amount)).toFixed(2)}
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
