import { FormContainer, TextField } from 'component';
import { FC, ReactElement, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { useBankLists, useDebounce } from 'store';
import { ValueLabelProps } from 'typings';
import { blockInvalidChar, reactSelectStyles } from 'utils';

export const AddBankAccount: FC = () => {
  const { control, watch } = useFormContext();
  const [searchText, setSearchText] = useState('America');

  const debounceText = useDebounce(searchText, 1000);

  const routingNumber = useDebounce(watch('routing_number'), 1000);

  const { data, isLoading } = useBankLists(debounceText, routingNumber);
  const tempData = data?.map((item) => {
    return { label: item.name, value: item.name };
  });

  return (
    <>
      <Controller
        control={control}
        name="account_name"
        rules={{ required: 'Bank Account Nickname is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Bank Account Nickname" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Create Bank Account Nickname"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="account_number"
        rules={{ required: 'Bank Account Number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Bank Account Number" errorMessage={error?.message ?? ''}>
            <TextField
              type="number"
              value={value ?? ''}
              onKeyDown={blockInvalidChar}
              placeholder="Enter Account Number"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="routing_number"
        rules={{ required: 'Address is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Bank Routing Number" errorMessage={error?.message ?? ''}>
            <TextField
              type="number"
              value={value ?? ''}
              onKeyDown={blockInvalidChar}
              placeholder="Enter Routing Number"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="bank_name"
        rules={{ required: 'Bank Name is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer label="Select Bank Name" errorMessage={error?.message ?? ''}>
              <Select
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select Bank Name"
                isLoading={isLoading}
                options={tempData}
                onChange={(e: SingleValue<ValueLabelProps>): void => {
                  onChange(e?.value);
                }}
                onInputChange={(e: string): void => setSearchText(e)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />
    </>
  );
};
