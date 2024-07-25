/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, Textarea } from '@chakra-ui/react';
import { FormContainer, Label } from 'component';
import { QuxTokenIcon } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useCryptoPaymentData, useSelectedBankDetails, useType } from 'store';
import { useSelectedCrypto } from 'store/useSelectedCrypto';
import { calculateFivePercent, calculateThreePercent } from 'utils/calculatePercent';

export const DepositStepTwo: FC<{ label: string }> = ({ label }) => {
  const type = useType((e) => e.type);
  const method = useFormContext();
  const { control, watch } = method;
  const selectedBankDetails = useSelectedBankDetails((e) => e.selectedBankDetails);
  const selectedCrypto = useSelectedCrypto((e) => e.selectedCrypto);
  const cryptoPaymentData = useCryptoPaymentData((e) => e.cryptoPaymentData);
  const amount = watch('amount');

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

      <Label label={`${label} Amount:`} image={QuxTokenIcon} amount={amount || 0.0} />
      <Label
        label="Token Fee"
        image={QuxTokenIcon}
        amount={(label === 'Redeem' ? calculateFivePercent(amount) : calculateThreePercent(amount)) || 0.0}
      />
      <Label
        label="Total Purchase amount:"
        image={QuxTokenIcon}
        amount={
          (label === 'Redeem' ? amount + calculateFivePercent(amount) : amount + calculateThreePercent(amount)) || 0.0
        }
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
              <Textarea value={value || ''} placeholder="Comment (Optional)" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          </Box>
        )}
      />
    </Box>
  );
};
