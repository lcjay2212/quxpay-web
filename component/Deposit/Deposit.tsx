/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAccountPaymentId, useCongratulationContent, useCryptoPaymentData, useType } from 'store';
import { useDecryptedCoreBalance } from 'store/useDecryptedCoreBalance';
import { useDecryptedCoreWallet } from 'store/useDecryptedCoreWallet';
import { useDecryptedData } from 'store/useDecryptedData';
import { useDecryptedUserBanks } from 'store/useDecryptedUserBanks';
import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { notify } from 'utils';
import { encryptData } from 'utils/encryptData';
import { DepositStepOne } from './DepositStepOne';
import { DepositStepTwo } from './DepositStepTwo';

export const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const [type, setType] = useType((e) => [e.type, e.setType]);
  const method = useForm();
  const { handleSubmit, watch } = method;
  const setVisible = useCongratulationContent((e) => e.setVisible);
  const paymentData = useAccountPaymentId((e) => e.paymentData);
  const [step, setStep] = useState(1);
  const selectedCrypto = useSelectedCrypto((e) => e.selectedCrypto);
  const cryptoPaymentData = useCryptoPaymentData((e) => e.cryptoPaymentData);
  const { data: details, dataLoading } = useDecryptedData('wallets');
  const coreBalance = useDecryptedCoreBalance((e) => e.coreBalance);
  const [decryptedWallets, setDecryptedWallets] = useDecryptedCoreWallet((e) => [
    e.decryptedWallets,
    e.setDecryptedWallets,
  ]);

  // eslint-disable-next-line no-console
  console.log({ decryptedWallets, coreBalance });
  const setBanksDetails = useDecryptedUserBanks((e) => e.setBankDetails);

  useEffect(() => {
    if (details) {
      const banks = JSON.parse(details.details.core);

      setDecryptedWallets(details);
      setBanksDetails(banks);
    }
  }, [details, setDecryptedWallets, setBanksDetails]);

  const amount = watch('amount');

  const { setAmount, setCongratsType } = useCongratulationContent((e) => ({
    setAmount: e.setAmount,
    setCongratsType: e.setType,
  }));

  const headers = {
    Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
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

  const useCustomMutation = (url?: string, onSuccess?: () => void, onError?: (error: any) => void): any =>
    useMutation({
      mutationFn: (variable) => postRequest(url, variable),
      onSuccess,
      onError,
    });

  const { mutate, isPending } = useCustomMutation(`${STAGING_URL}/${url2}`, handleSuccess, handleError);

  const { mutate: addCrypto, isPending: addCryptoLoading } = useCustomMutation(
    `${STAGING_URL}/web/crypto/create-wallet`,
    () => setStep((e) => e + 1),
    () => notify('Failed to create Crypto Wallet', { status: 'error' })
  );

  const { mutate: completeCryptoPayment, isPending: paymentLoading } = useCustomMutation(
    `${STAGING_URL}/web/crypto/complete-transaction`,
    handleSuccess,
    () => notify('Failed to create Crypto Wallet', { status: 'error' })
  );

  const { mutate: checkCryptoTransaction, isPending: checkLoading } = useCustomMutation(
    `${STAGING_URL}/web/crypto/check-transaction`,
    () => setStep((e) => e + 1),
    ({ response }: any) => notify(response?.data?.data?.message, { status: 'warning' })
  );

  const getUrl = (): string => {
    switch (type) {
      case 'CREDIT':
        return 'web/validate/add-credit-card';
      case 'ADD_BANK':
        return 'web/validate/add-bank-account';
      default:
        return url; // Default case
    }
  };

  const { mutate: validate, isPending: validateLoading } = useCustomMutation(
    `${STAGING_URL}/${getUrl()}`,
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

  const { mutate: updateMainFile, isPending: updateMainFileLoading } = useCustomMutation(
    `${STAGING_URL}/web/encryption/updated/main-file`,
    handleSuccess,
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

  const onSubmit = (val): void => {
    const purchaseRedeemVal = {
      ...val,
      payment_type: paymentData?.paymentType,
    };

    const addCreditCardVal = {
      ...val,
      card_holder_name: `${val.firstname} ${val.lastname}`,
      address2: val.address2 || '',
      expiration_date: val.expiration_date?.replace('/', ''),
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
          validate(addCreditCardVal);
          break;

        case 'ADD_BANK':
          validate({ ...val });

          break;

        default:
          validate(purchaseRedeemVal);
          break;
      }
    };

    const handleEncryptedContent = (name: string): void => {
      let content;
      let encryptionTarget;

      switch (type) {
        case 'CREDIT':
          content = {
            [`${name}`]: [addCreditCardVal],
          };
          encryptionTarget = 'wallets';
          break;

        case 'ADD_BANK':
          content = {
            [`${name}`]: [{ ...val }],
          };
          encryptionTarget = 'wallets';
          break;

        default:
          content = {
            [`${name}_tokens`]: [purchaseRedeemVal],
          };
          encryptionTarget = 'balance';
          break;
      }

      if (coreBalance) {
        const encryptedData = encryptData(JSON.stringify(content), coreBalance, encryptionTarget);
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

            case 'CREDIT':
              handleEncryptedContent('add_credit_card');
              break;

            case 'ADD_BANK':
              handleEncryptedContent('add-bank-account');
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

            <Box mt="2rem">
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                w="400px"
                h="3.25rem"
                isLoading={
                  isPending ||
                  addCryptoLoading ||
                  paymentLoading ||
                  checkLoading ||
                  validateLoading ||
                  updateMainFileLoading
                }
              >
                {step === 1
                  ? label === 'Purchase' && type === 'CRYPTO'
                    ? 'Send your Crypto and Continue'
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
                  isLoading={isPending}
                  mt="1rem"
                  onClick={(): void => {
                    void router.push('dashboard');
                    setType(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  );
};
