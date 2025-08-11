/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
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
import { useQuery } from '@tanstack/react-query';
import {
  AddBankAccount,
  AddCreditCardForm,
  BankAccount,
  CashInCrypto,
  CreditCard,
  FormContainer,
  TextField,
} from 'component';
import { FETCH_BANK_CREDIT_CARD_CRYPTO } from 'constants/api';
import { useBankStatus } from 'hooks';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useAccountPaymentId, useSelectedBankDetails, useType } from 'store';
// import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { notify, queryClient } from 'utils';
export const DepositStepOne: FC<{ label: string; loading: boolean }> = ({ label, loading }) => {
  const method = useFormContext();
  const { control } = method;
  const bankDetails = queryClient.getQueryData<{ initialData: Details; banks: UserBankDetails }>([
    'walletsSecurityFile',
  ]);

  const [type, setType] = useType((e) => [e.type, e.setType]);
  const setPaymentData = useAccountPaymentId((e) => e.setPaymentData);
  const setSelectedBankDetails = useSelectedBankDetails((e) => e.setSelectedBankDetails);
  // const setSelectedCrypto = useSelectedCrypto((e) => e.setSelectedCrypto);
  const { data: bankStatus } = useBankStatus();
  const { data } = useQuery({
    queryKey: ['bandAndCreditDetails'],
    queryFn: FETCH_BANK_CREDIT_CARD_CRYPTO,
  });

  return (
    <>
      <Box display="flex" flexDir="column">
        {type !== 'CREDIT' && type !== 'ADD_BANK' && (
          <Controller
            control={control}
            name="amount"
            rules={{
              required: 'Amount is required',
              validate: (value): string | true => value >= 20 || 'Amount must be at least $20',
            }}
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
                  formNoValidate
                />
              </FormContainer>
            )}
          />
        )}

        <RadioGroup>
          <Controller
            control={control}
            name="payment_profile_id"
            rules={{
              required: !type ? 'Please select an account' : false,
            }}
            render={({ field: { onChange }, fieldState: { error } }): ReactElement => {
              if (error) {
                notify('Please select an account', { status: 'error' });
              }
              return (
                <>
                  {label === 'Redeem' && (
                    <Text color="white" textAlign="start" fontWeight="bold" fontSize="2rem">
                      To My Bank
                    </Text>
                  )}
                  {!loading ? (
                    <FormControl>
                      {bankDetails?.banks.bank.length ? (
                        bankDetails.banks.bank.map((item, index) => {
                          const { accountNumber, nameOnAccount, bank_name } = item.payment.bankAccount;

                          return (
                            <Flex justifyContent="space-between" key={index}>
                              <Box mt="1rem">
                                <BankAccount
                                  bankName={bank_name}
                                  name={nameOnAccount}
                                  accountNumber={accountNumber}
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
                                value={`${item.customerPaymentProfileId}`}
                                colorScheme="teal"
                                onChange={(): void => {
                                  onChange(item.customerPaymentProfileId);
                                  setPaymentData({
                                    paymentId: item.customerPaymentProfileId,
                                    paymentType: item.payment_type,
                                  });
                                  setSelectedBankDetails(item);
                                  setType('BANK');
                                }}
                              />
                            </Flex>
                          );
                        })
                      ) : (
                        <></>
                      )}

                      {label === 'Purchase' && (
                        <>
                          {!isEmpty(data?.credit_card) && (
                            <>
                              {data?.credit_card.map((item: any) => {
                                return (
                                  <Flex justifyContent="space-between" key={item.customerPaymentProfileId}>
                                    <Box mt="1rem">
                                      <CreditCard
                                        accountNumber={item.payment.creditCard.cardNumber ?? ''}
                                        cardType={item.payment.creditCard.cardType ?? ''}
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
                                      value={`${item.customerPaymentProfileId}`}
                                      colorScheme="teal"
                                      onChange={(): void => {
                                        onChange(item.customerPaymentProfileId);
                                        setPaymentData({
                                          paymentId: item.customerPaymentProfileId,
                                          paymentType: item.payment_type,
                                        });
                                        setSelectedBankDetails(item as any);
                                        setType('EXISTING_CREDITCARD');
                                      }}
                                    />
                                  </Flex>
                                );
                              })}
                            </>
                          )}
                        </>
                      )}
                    </FormControl>
                  ) : (
                    <Box height="300px" display="flex" justifyContent="center" alignItems="center">
                      <Spinner size="xl" />
                    </Box>
                  )}
                </>
              );
            }}
          />

          {bankStatus?.status !== 'Pending' && <Divider mt="1rem" />}

          {/* {label === 'Redeem' && (
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
                      {!loading ? (
                        <FormControl isInvalid={!!error?.message}>
                          {bankDetails?.banks.crypto.length ? (
                            bankDetails.banks.crypto.map((item, index) => (
                              <Flex justifyContent="space-between" key={index}>
                                <Box mt="1rem">
                                  <CryptoWallet
                                    address={item.address}
                                    name={item.name}
                                    type={item.currency}
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
                                  value={`${item.address}-${index}`}
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
                      ) : (
                        <Box height="300px" display="flex" justifyContent="center" alignItems="center">
                          <Spinner size="xl" />
                        </Box>
                      )}
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
                  <Image src="/assets/icons/add-crypto-icon.webp" height={50} width={60} alt="Add Bank Icon" />
                  <Text ml="1rem" color="white" fontSize="1.25rem">
                    Add New Crypto Wallet
                  </Text>
                </Flex>

                <Radio value="ADD_CRYPTO" onChange={(): void => setType('ADD_CRYPTO')} colorScheme="teal" />
              </Flex>
              {type === 'ADD_CRYPTO' && <AddCrytoWallet />}

              <Divider mt="1rem" />
            </>
          )} */}

          {label === 'Purchase' && (
            <>
              {bankStatus?.status !== 'Pending' && (
                <Flex my="1.5rem" justifyContent="space-between">
                  <Flex alignItems="center">
                    <Image src="/assets/icons/add-bank-icon.webp" height={50} width={60} alt="Add Bank Icon" />
                    <Text ml="1rem" color="white" fontSize="1.25rem">
                      Add New Bank Account
                    </Text>
                  </Flex>

                  <Radio value="ADD_BANK" onChange={(): void => setType('ADD_BANK')} colorScheme="teal" />
                </Flex>
              )}
              {type === 'ADD_BANK' && <AddBankAccount />}
              <Divider mt="1rem" />

              <Flex my="1.5rem" justifyContent="space-between">
                <Flex alignItems="center">
                  <Image src="/assets/icons/add_credit_card_icon.webp" height={50} width={60} alt="Add Bank Icon" />
                  <Text ml="1rem" color="white" fontSize="1.25rem">
                    Add New Credit Card
                  </Text>
                </Flex>

                <Radio value="CREDIT" onChange={(): void => setType('CREDIT')} colorScheme="teal" />
              </Flex>
              {type === 'CREDIT' && <AddCreditCardForm />}
              <Divider mt="1rem" />

              <Flex my="1.5rem" justifyContent="space-between">
                <Flex alignItems="center">
                  <Image src="/assets/icons/add-crypto-icon.webp" height={50} width={60} alt="Add Bank Icon" />
                  <Text ml="1rem" color="white" fontSize="1.25rem">
                    Cash In Crypto
                  </Text>
                </Flex>

                <Radio value="CRYPTO" onChange={(): void => setType('CRYPTO')} colorScheme="teal" />
              </Flex>
              {type === 'CRYPTO' && <CashInCrypto />}
            </>
          )}
        </RadioGroup>

        <Divider />
      </Box>
    </>
  );
};
