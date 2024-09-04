/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAccountPaymentId, useCongratulationContent, useCryptoPaymentData, useType } from 'store';
import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { notify } from 'utils';
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

  const { mutate, isPending } = useCustomMutation(
    `${STAGING_URL}/${
      type === 'BANK' || type === 'EXISTING_CREDITCARD' ? url : type !== 'CREDIT' ? url2 : 'web/wallet/add-credit-card'
    }`,
    handleSuccess,
    handleError
  );

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

  const onSubmit = (val): void => {
    if (step === 1) {
      if (type === 'ADD_CRYPTO') {
        addCrypto({ address: val.address, name: val.name, currency: val.currency });
      } else if (type === 'CRYPTO') {
        checkCryptoTransaction({
          payment_id: cryptoPaymentData?.payment_id,
          pos_id: cryptoPaymentData?.pos_id,
          currency: cryptoPaymentData?.currency,
          address: cryptoPaymentData?.address,
          type: 'purchase',
        });
      } else {
        setStep((e) => e + 1);
      }
      return;
    }

    if (step === 2) {
      const commonData = { ...val };
      if (label === 'Purchase') {
        if (type === 'CREDIT') {
          mutate({
            ...commonData,
            card_holder_name: `${val.firstname} ${val.lastname}`,
            address2: val.address2 || '',
            expiration_date: val.expiration_date?.replace('/', ''),
          });
        } else if (type === 'CRYPTO') {
          completeCryptoPayment({
            payment_id: cryptoPaymentData?.payment_id,
            pos_id: cryptoPaymentData?.pos_id,
            currency: cryptoPaymentData?.currency,
            address: cryptoPaymentData?.address,
            type: 'purchase',
          });
        } else {
          mutate({ ...commonData, payment_method: paymentData?.paymentType });
        }
      } else if (label === 'Redeem') {
        mutate({
          ...commonData,
          ...(type === 'ADD_CRYPTO' || type === 'CRYPTO'
            ? { amount, address: selectedCrypto?.address || val.address }
            : {}),
        });
      }
    }
  };

  return (
    <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" justifyContent="space-between" minH="90vh" h="auto">
            {step === 1 && <DepositStepOne label={label} />}
            {step === 2 && <DepositStepTwo label={label} />}

            <Box mt="2rem">
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                w="400px"
                h="3.25rem"
                isLoading={isPending || addCryptoLoading || paymentLoading || checkLoading}
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
