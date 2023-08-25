import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { startCase } from 'lodash';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
const SecondStep: FC = () => {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="firstname"
        rules={{ required: 'First name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="First Name" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter First Name"
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
        name="lastname"
        rules={{ required: 'Last name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Last Name" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Last Name"
              onChange={(e): void => onChange(startCase(e.target.value))}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="billing_address"
        rules={{ required: 'Address is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Billing Address" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. 123 Street Ave."
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
        name="address_2"
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Address 2 (optional)" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. Suite, Apt"
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
        name="city"
        rules={{ required: 'City is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="City" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter City"
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
        name="state"
        rules={{ required: 'State is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="State" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter State"
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
        name="zip"
        rules={{ required: 'Zip is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Zip" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Zip Code" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="phone_number"
        rules={{ required: 'Phone number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Phone" errorMessage={error?.message ?? ''}>
            <TextField
              type="number"
              value={value ?? ''}
              placeholder="Enter Phone e.g. 505-555-5555"
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={(e): void => {
                const invalidChars = ['+', '-', '.', 'e'];
                if (invalidChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </FormContainer>
        )}
      />
    </>
  );
};

export default SecondStep;
