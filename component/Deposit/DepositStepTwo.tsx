/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Spinner, Text, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import { FormContainer, Label } from 'component';
import { STAGING_URL } from 'constants/url';
import { QuxTokenIcon } from 'public/assets';
import { FC, ReactElement, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useCryptoPaymentData, useSelectedBankDetails, useType } from 'store';
import { useSelectedCrypto } from 'store/useSelectedCrypto';

export const DepositStepTwo: FC<{ label: string }> = ({ label }) => {
  const type = useType((e) => e.type);
  const method = useFormContext();
  const { control, watch } = method;
  const selectedBankDetails = useSelectedBankDetails((e) => e.selectedBankDetails);
  const selectedCrypto = useSelectedCrypto((e) => e.selectedCrypto);
  const cryptoPaymentData = useCryptoPaymentData((e) => e.cryptoPaymentData);
  const amount = watch('amount');
  const [computationData, setComputationData] = useState<{
    amount: number;
    qux_charge: number;
    total_amount: number;
  }>();

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/wallet/computation`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        setComputationData(data?.data);
      },
      onError: () => {
        // notify(`Failed to send request`, { status: 'error' });
      },
    }
  );

  useEffect(() => {
    mutate({ type: label === 'Redeem' ? 'withdraw' : 'purchase', amount } as any);
  }, [amount, label, mutate]);

  return (
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
              <Text noOfLines={1}>Sending To: {selectedBankDetails?.payment.bankAccount.bank_name}</Text>
              <Text>Account Name: {selectedBankDetails?.payment.bankAccount.nameOnAccount}</Text>
            </>
          )}
          {(type === 'ADD_CRYPTO' || type === 'CRYPTO') && (
            <>
              <Text noOfLines={1}>Sending ${amount} in tokens</Text>
              <Text>To: {type === 'CRYPTO' && selectedCrypto?.address}</Text>
            </>
          )}
        </Box>
      )}

      {!isLoading ? (
        <>
          <Label label={`${label} Amount`} image={QuxTokenIcon} amount={computationData?.amount || 0.0} />
          <Label label="Token Fee" image={QuxTokenIcon} amount={computationData?.qux_charge || 0.0} />
          <Label
            label={label === 'Redeem' ? 'Total to Redeem' : 'Total Purchase amount:'}
            image={QuxTokenIcon}
            amount={computationData?.total_amount || 0.0}
          />
        </>
      ) : (
        <Box justifyContent="center">
          <Spinner color="primary" />
        </Box>
      )}

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
              <Textarea value={value || ''} placeholder="Comment (Optional)" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          </Box>
        )}
      />
    </Box>
  );
};
