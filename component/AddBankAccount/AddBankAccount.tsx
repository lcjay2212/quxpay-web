import { CSSObject } from '@emotion/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_BANK_LIST } from 'constants/api';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import Select from 'react-select';
import { blockInvalidChar } from 'utils/blockInvalidChar';
import errorHandler from 'utils/errorHandler';

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
    border: '1px solid #cccccc',
    borderRadius: '16px',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem',
    background: '#3D3C3C',
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

const AddBankAccount: FC = () => {
  const { control } = useFormContext();
  const { data, isLoading } = useQuery('bankList', FETCH_BANK_LIST, errorHandler);
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
                onChange={(e: { value?: string; label?: string }): void => onChange(e.value)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />
    </>
  );
};

export default AddBankAccount;
