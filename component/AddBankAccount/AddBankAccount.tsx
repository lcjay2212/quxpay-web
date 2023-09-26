import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { startCase } from 'lodash';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { blockInvalidChar } from 'utils/blockInvalidChar';
const AddBankAccount: FC = () => {
  const { control } = useFormContext();

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
              onChange={(e): void => {
                onChange(startCase(e.target.value));
              }}
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
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Select Bank Name" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Bank Name"
              onChange={(e): void => {
                onChange(startCase(e.target.value));
              }}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />
    </>
  );
};

export default AddBankAccount;
