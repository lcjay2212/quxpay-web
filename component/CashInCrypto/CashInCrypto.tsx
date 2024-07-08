import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { ValueLabelProps } from 'component/RegistrationForm/FinalStep';
import { FETCH_CRYPTO_CURRENCY_LIST } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { ClipboardIcon } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import Select, { SingleValue } from 'react-select';
import { useCryptoPaymentData } from 'store/useCryptoPaymentData';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

export const reactSelectStyles = {
  menu: (provided: CSSObject): CSSObject => ({
    ...provided,
    marginTop: 5,
  }),
  control: (provided: CSSObject): CSSObject => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '16px',
    color: 'white',
  }),
  indicatorsContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    display: 'none',
    color: 'white',
  }),
  valueContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    padding: 13,
    fontSize: '1rem',
    border: '1px solid #4D4D6B',
    borderRadius: '16px',
    background: '#10101F',
    textAlign: 'start',
    color: 'white',
    ':active': {
      background: '#000000',
      borderColor: '#06A499',
    },
  }),
  singleValue: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
  input: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
};

const CashInCrypto: FC = () => {
  const { control, watch } = useFormContext();

  const { data } = useQuery('productList', FETCH_CRYPTO_CURRENCY_LIST, errorHandler);
  const [cryptoPaymentData, setCryptoPaymentData] = useCryptoPaymentData((e) => [
    e.cryptoPaymentData,
    e.setCryptoPaymentData,
  ]);

  const tempData = data?.map((item) => {
    return { label: item.currency, value: item.buy_rate, fee: item.buy_network_processing_fee };
  });

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(cryptoPaymentData?.payment_id || '');
      // setMessage('Text copied to clipboard!');
      notify('Text copied to clipboard!', { status: 'info' });
    } catch (err) {
      notify('Failed to copy text', { status: 'info' });
    }
  };

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/crypto/payment`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          'QuxPay-Web': 1,
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        setCryptoPaymentData(data?.data);
      },
      onError: ({ response }) => {
        notify(`${response?.data?.message || response?.data?.data.errors.amount}`, { status: 'error' });
      },
    }
  );

  return (
    <>
      <Controller
        control={control}
        name="currency"
        rules={{ required: 'Bank Name is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer label="Select Bank Name" errorMessage={error?.message ?? ''}>
              <Select
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select Crypto Type"
                // isLoading={isLoading}
                options={tempData}
                onChange={(e: SingleValue<ValueLabelProps>): void => {
                  onChange(e?.label);
                  mutate({
                    currency: e?.label,
                    amount: watch('amount'),
                  } as any);
                }}
                // onInputChange={(e: string): void => setSearchText(e)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />

      {cryptoPaymentData && (
        <Box mb="2rem">
          {!isLoading ? (
            <>
              <Box color="white">
                <Text fontSize="24px">Current Exchange Value</Text>
                <Text fontSize="24px">${Number(cryptoPaymentData.rate).toFixed(2)}</Text>
              </Box>
              <Box textAlign="start" mt="2rem">
                <Text fontSize="18px" color="white">
                  Send {cryptoPaymentData.amount_exchange} {cryptoPaymentData.currency} To This <br /> Temporary Wallet
                </Text>
              </Box>
              <Flex gap={4} alignItems="center" mt="0.5rem">
                <Text textAlign="start">{cryptoPaymentData.address}</Text>
                <Box cursor="pointer" onClick={copyToClipboard}>
                  <Image src={ClipboardIcon} height={30} width={32} alt="Clipboard" />
                </Box>
              </Flex>
              <Flex justifyContent="center" mt="2rem">
                <Image src={`${cryptoPaymentData.qr_img}`} height={250} width={250} alt="QR Code" />
              </Flex>
            </>
          ) : (
            <Flex justifyContent="center">
              <Spinner color="primary" />
            </Flex>
          )}
        </Box>
      )}
    </>
  );
};

export default CashInCrypto;
