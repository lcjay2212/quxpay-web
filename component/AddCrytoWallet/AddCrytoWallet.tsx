import { Box, Flex, Text } from '@chakra-ui/react';
import { FormContainer, TextField } from 'component';
import { CRYPTO } from 'mocks/crypto';
import Image from 'next/image';
import { PasteIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { ValueLabelProps } from 'typings';
import { notify, reactSelectStyles } from 'utils';

export const AddCrytoWallet: FC = () => {
  const { control } = useFormContext();
  const [pasteValue, setPasteValue] = useState('');
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
                  value={value || pasteValue || ''}
                  placeholder="Enter Cryptocurrency Address"
                  onChange={(e): void => {
                    onChange(e.target.value || pasteValue);
                    setPasteValue(e.target.value);
                  }}
                  onBlur={onBlur}
                />
              </Box>

              <Box
                onClick={(): void =>
                  void navigator.clipboard
                    .readText()
                    .then((text) => {
                      setPasteValue(text);
                    })
                    .catch(() => {
                      notify('Failed to read clipboard contents: ', { status: 'error' });
                    })
                }
              >
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
