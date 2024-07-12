import { Box, Flex, Text } from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import { FormContainer } from 'component/FormInput';
import { ValueLabelProps } from 'component/RegistrationForm/FinalStep';
import { TextField } from 'component/TextField';
import { CRYPTO } from 'mocks/crypto';
import Image from 'next/image';
import { PasteIcon } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';

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

const AddCrytoWallet: FC = () => {
  const { control } = useFormContext();

  const tempData = CRYPTO.map((item) => {
    return { label: item.currency, value: item.buy_rate, fee: item.buy_network_processing_fee };
  });

  return (
    <>
      <Controller
        control={control}
        name="currency"
        rules={{ required: 'Currency is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer errorMessage={error?.message ?? ''}>
              <Select
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select Crypto Type"
                options={tempData}
                onChange={(e: SingleValue<ValueLabelProps>): void => {
                  onChange(e?.label);
                }}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />

      <Controller
        control={control}
        name="address"
        rules={{ required: 'Address date is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer errorMessage={error?.message ?? ''}>
            <Flex justifyContent="space-between" gap={4}>
              <Box w={'100%'}>
                <TextField
                  value={value ?? ''}
                  placeholder="Enter Cryptocurrency Address"
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </Box>

              <Box>
                <Image src={PasteIcon} height={40} width={40} alt="Paste Icon" />
                <Text fontSize="12px" mt="0.25rem">
                  Paste
                </Text>
              </Box>
            </Flex>
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Give Your Crypto Wallet A Nickname"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />
    </>
  );
};

export default AddCrytoWallet;
