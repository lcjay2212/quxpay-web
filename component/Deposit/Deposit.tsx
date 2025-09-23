/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAccountPaymentId, useCongratulationContent, useCryptoPaymentData, useType } from 'store';
import { useComputationData } from 'store/useComputationData';
import { useDecryptedData } from 'store/useDecryptedData';
import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { updateBalance } from 'store/useUpdateBalance';
import { notify, queryClient } from 'utils';
import { encryptData } from 'utils/encryptData';
import { DepositStepOne } from './DepositStepOne';
import { DepositStepTwo } from './DepositStepTwo';

export const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const [type, setType] = useType((e) => [e.type, e.setType]);
  const method = useForm();
  const { handleSubmit, watch, reset } = method;
  const setVisible = useCongratulationContent((e) => e.setVisible);
  const paymentData = useAccountPaymentId((e) => e.paymentData);
  const [step, setStep] = useState(1);
  const selectedCrypto = useSelectedCrypto((e) => e.selectedCrypto);
  const cryptoPaymentData = useCryptoPaymentData((e) => e.cryptoPaymentData);
  const balance = queryClient.getQueryData<{ initialData: Details; balance: any }>(['balanceSecurityFile']);
  const computationData = useComputationData((e) => e.computationData);

  const { data: wallet, dataLoading } = useDecryptedData('wallets');

  const amount = watch('amount');

  const { setAmount, setCongratsType } = useCongratulationContent((e) => ({
    setAmount: e.setAmount,
    setCongratsType: e.setType,
  }));

  const headers = {
    Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
    Version: 2,
  };

  const postRequest = async (url?: string, variable?: any): Promise<void> =>
    await axios.post(url || '', variable, { headers });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSuccess = () => {
    setVisible(true);
    setAmount(amount);
    setCongratsType(type as any);
  };

  const handleError = ({ response }: any): any => {
    const { errors, data } = response?.data || {};
    const errorMsg =
      errors?.account_number ||
      errors?.balance ||
      (errors?.amount === 'Amount is invalid, the maximum redeem is 1500. Thank you!' &&
        'The maximum amount to redeem should be 1500.');
    const creditErrorMsg = data?.message || 'Failed to Purchase using credit card';
    const cryptoErrorMsg = data?.errors?.address || data?.message;

    notify(
      type === 'CREDIT' ? creditErrorMsg : type === 'CRYPTO' || type === 'ADD_CRYPTO' ? cryptoErrorMsg : errorMsg,
      { status: 'error' }
    );
  };

  const useCustomMutation = (url?: string, onSuccess?: (data: any) => void, onError?: (error: any) => void): any =>
    useMutation({
      mutationFn: (variable) => postRequest(url, variable),
      onSuccess,
      onError,
    });

  const { mutate, isPending } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url2}`,
    handleSuccess,
    handleError
  );

  const { mutate: addCrypto, isPending: addCryptoLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/crypto/create-wallet`,
    () => setStep((e) => e + 1),
    () => notify('Failed to create Crypto Wallet', { status: 'error' })
  );

  const { mutate: completeCryptoPayment, isPending: paymentLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/crypto/complete-transaction`,
    handleSuccess,
    () => notify('Failed to create Crypto Wallet', { status: 'error' })
  );

  const { mutate: checkCryptoTransaction, isPending: checkLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/crypto/check-transaction`,
    () => setStep((e) => e + 1),
    ({ response }: any) => notify(response?.data?.data?.message, { status: 'warning' })
  );

  const { mutate: validate, isPending: validateLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`,
    () => setStep((e) => e + 1),
    ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || response?.data?.status?.message, { status: 'error' });
    }
  );

  const { mutate: addBankAccount, isPending: addBankAccountLoading } = useMutation({
    mutationFn: async (val: any) => {
      try {
        await postRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/validate/add-bank-account`, val);

        const content = {
          [`added_bank_accounts`]: [{ ...val, payment_type: 'ach_bank' }],
        };
        const encryptionTarget = 'wallets';
        const core = wallet.initialData;

        if (core) {
          const encryptedData = encryptData(JSON.stringify(content), core, encryptionTarget);
          updateMainFile(encryptedData);
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      notify('Bank Account Added Successfully', { status: 'success' });
      setType(null);
      void router.push('/dashboard');
    },
    onError: ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || response?.data?.status?.message, { status: 'error' });
    },
  });

  const { mutate: addCreditCard, isPending: addCreditCardLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wallet/add-credit-card`,
    (): void => {
      reset();
      setType(null);
      void queryClient.invalidateQueries({ queryKey: ['bandAndCreditDetails'] });
    },
    ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message || response?.data?.status?.message, { status: 'error' });
    }
  );

  const { mutate: updateMainFile, isPending: updateMainFileLoading } = useCustomMutation(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/encryption/updated/main-file`,
    () => {
      setAmount(amount);
      const { balance: availableBalance, deposit, withdraw_pending } = balance?.balance || {};

      if (label === 'Redeem') {
        if (type === 'BANK') {
          updateBalance({
            withdraw_pending: +(withdraw_pending ?? 0) + amount,
            balance: +(availableBalance ?? 0) - (computationData?.total_amount ?? 0),
          });
          setVisible(true);
        } else if (type === 'EXISTING_CREDITCARD') {
          updateBalance({
            balance: +(availableBalance ?? 0) + amount,
          });
          setVisible(true);
        }
      } else {
        if (type === 'BANK') {
          updateBalance({
            deposit: +(deposit ?? 0) + amount,
          });
          setVisible(true);
        }
      }
    },
    ({ response }: any) => {
      let message = '';

      if (response?.data?.errors) {
        Object.values(response.data.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }

      notify(message, { status: 'error' });
    }
  );

  const getButtonText = (): string => {
    if (step === 1) {
      if (label === 'Purchase' && type === 'CRYPTO') {
        return 'Send your Crypto and Continue';
      }
      if (type === 'CREDIT') {
        return 'Save New Card';
      }
      if (type === 'ADD_BANK') {
        return 'Add Bank Account';
      }
      return label;
    }

    if (label === 'Redeem') {
      if (type === 'BANK') {
        return 'Initiate Bank Redeem';
      }
      return 'Confirm Crypto Redeem';
    }

    if (type === 'ADD_CRYPTO') {
      return 'Complete - Return to Home';
    }

    return `Confirm ${label}`;
  };

  const onSubmit = (val): void => {
    const purchaseRedeemVal = {
      ...val,
      payment_type: paymentData?.paymentType,
    };

    const addCreditCardVal = {
      firstname: val.firstname,
      lastname: val.lastname,
      card_number: val.card_number,
      card_holder_name: `${val.firstname} ${val.lastname}`,
      card_code: val.card_code,
      expiration_date: val.expiration_date?.replace('/', ''),
      address: val.address,
      address2: val.address2 || '',
      city: val.city,
      state: val.state,
      zip: val.zip,
      default: true,
    };

    const handleStepOne = (): void => {
      switch (type) {
        case 'ADD_CRYPTO':
          addCrypto({ address: val.address, name: val.name, currency: val.currency });
          break;

        case 'CRYPTO':
          checkCryptoTransaction({
            payment_id: cryptoPaymentData?.payment_id,
            pos_id: cryptoPaymentData?.pos_id,
            currency: cryptoPaymentData?.currency,
            address: cryptoPaymentData?.address,
            type: 'purchase',
          });
          break;

        case 'CREDIT':
          addCreditCard(addCreditCardVal);
          break;

        case 'ADD_BANK':
          addBankAccount({ amount: 0, payment_type: 'ach_bank', ...val });
          break;

        default:
          validate(purchaseRedeemVal);
          break;
      }
    };

    const handleEncryptedContent = (name: string): void => {
      let content;
      let encryptionTarget;
      let core;

      switch (type) {
        case 'EXISTING_CREDITCARD':
          content = {
            [`${name}_tokens`]: [
              { amount: val.amount, payment_profile_id: val.payment_profile_id, payment_type: 'authorize_creditcard' },
            ],
          };
          encryptionTarget = 'balance';
          core = balance?.initialData;
          break;

        case 'ADD_BANK':
          content = {
            [`${name}`]: [{ ...val, payment_type: 'ach_bank' }],
          };
          encryptionTarget = 'wallets';
          core = wallet.initialData;
          break;

        default:
          content = {
            [`${name}_tokens`]: [purchaseRedeemVal],
          };
          encryptionTarget = 'balance';
          core = balance?.initialData;
          break;
      }

      if (core) {
        const encryptedData = encryptData(JSON.stringify(content), core, encryptionTarget);
        updateMainFile(encryptedData);
      }
    };

    const handleStepTwo = (): void => {
      switch (label) {
        case 'Purchase':
          switch (type) {
            case 'CRYPTO':
              completeCryptoPayment({
                payment_id: cryptoPaymentData?.payment_id,
                pos_id: cryptoPaymentData?.pos_id,
                currency: cryptoPaymentData?.currency,
                address: cryptoPaymentData?.address,
                type: 'purchase',
              });
              break;

            case 'EXISTING_CREDITCARD':
              handleEncryptedContent('purchase');
              break;

            case 'ADD_BANK':
              handleEncryptedContent('added_bank_accounts');
              break;

            default:
              handleEncryptedContent('purchase');
              break;
          }
          break;

        case 'Redeem':
          if (['ADD_CRYPTO', 'CRYPTO'].includes(type || '')) {
            mutate({
              ...val,
              amount,
              address: selectedCrypto?.address || val.address,
            });
          } else {
            handleEncryptedContent('redeem');
          }
          break;

        default:
          // Handle other labels if needed
          break;
      }
    };

    if (step === 1) {
      handleStepOne();
    }
    if (step === 2) {
      handleStepTwo();
    }
  };

  return (
    <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" justifyContent="space-between" minH="90vh" h="auto">
            {step === 1 && <DepositStepOne label={label} loading={dataLoading} />}
            {step === 2 && <DepositStepTwo label={label} />}

            <Flex mt="2rem" flexDirection="column">
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                h="3.25rem"
                isLoading={
                  isPending ||
                  addCryptoLoading ||
                  paymentLoading ||
                  checkLoading ||
                  validateLoading ||
                  updateMainFileLoading ||
                  addCreditCardLoading ||
                  addBankAccountLoading
                }
              >
                {getButtonText()}
              </Button>

              {step === 2 && (
                <Button
                  variant="secondary"
                  borderRadius="1rem"
                  h="3.25rem"
                  isLoading={
                    isPending ||
                    addCryptoLoading ||
                    paymentLoading ||
                    checkLoading ||
                    validateLoading ||
                    updateMainFileLoading
                  }
                  mt="1rem"
                  onClick={(): void => {
                    void router.push('dashboard');
                    setType(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  );
};
