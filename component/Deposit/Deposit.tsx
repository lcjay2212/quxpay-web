/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useAccountPaymentId, useCongratulationContent, useCryptoPaymentData, useType } from 'store';
import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { notify } from 'utils';
import { DepositStepOne } from './DepositStepOne';
import { DepositStepTwo } from './DepositStepTwo';

export const Deposit: FC<{ label: string; url: string; url2?: string }> = ({ label, url, url2 }) => {
  const router = useRouter();
  const type = useType((e) => e.type);
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

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(
        `${STAGING_URL}/${
          type === 'BANK' || type === 'EXISTING_CREDITCARD'
            ? url
            : type !== 'CREDIT'
            ? url2
            : 'web/wallet/add-credit-card'
        }`,
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
        setCongratsType(type as any);
      },
      onError: ({ response }) => {
        const { errors, data } = response?.data || {};
        const errorMsg = errors?.account_number || errors?.balance || errors?.amount;
        const creditErrorMsg = data?.message || 'Failed to Purchase using credit card';
        const cryptoErrorMsg = data?.errors?.address || data?.message;

        notify(
          type === 'CREDIT' ? creditErrorMsg : type === 'CRYPTO' || type === 'ADD_CRYPTO' ? cryptoErrorMsg : errorMsg,
          { status: 'error' }
        );
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
        setCongratsType(type as any);
      },
      onError: () => {
        notify(`Failed to create Crypto Wallet`, { status: 'error' });
      },
    }
  );

  const { mutate: checkCryptoTransaction, isLoading: checkLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/crypto/check-transaction`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        setStep((e) => e + 1);
      },
      onError: ({ response }) => {
        notify(response?.data?.data?.message, { status: 'warning' });
      },
    }
  );

  const onSubmit = (val): void => {
    if (step === 1) {
      if (type === 'ADD_CRYPTO') {
        addCrypto({ address: val.address, name: val.name, currency: val.currency } as any);

        return;
      }

      if (type === 'CRYPTO') {
        checkCryptoTransaction({
          payment_id: cryptoPaymentData?.payment_id,
          pos_id: cryptoPaymentData?.pos_id,
          currency: cryptoPaymentData?.currency,
          address: cryptoPaymentData?.address,
          type: 'purchase',
        } as any);
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
            expiration_date: val.expiration_date.replace('/', ''),
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
          mutate({ ...val, payment_method: paymentData?.paymentType });
        }
      } else if (label === 'Redeem') {
        mutate({
          ...val,
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
                isLoading={isLoading || addCryptoLoading || paymentLoading || checkLoading}
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
    </Box>
  );
};
