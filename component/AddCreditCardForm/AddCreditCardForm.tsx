import { Flex } from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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

const AddCreditCardForm: FC = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name="card_number"
        rules={{ required: 'Card number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Card Number" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Card Number" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Flex gap={4}>
        <Controller
          control={control}
          name="expiry_date"
          rules={{ required: 'Expiry date is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer label="Expiry Date" errorMessage={error?.message ?? ''}>
              <TextField value={value ?? ''} placeholder="(MM/YY)" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          )}
        />
        <Controller
          control={control}
          name="security_code"
          rules={{ required: 'Security Code is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer label="Security Code" errorMessage={error?.message ?? ''}>
              <TextField value={value ?? ''} placeholder="CVV" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          )}
        />
      </Flex>

      <Controller
        control={control}
        name="card_name"
        rules={{ required: 'Name on Card is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Name on Card" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Name on Card" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="billing_address"
        rules={{ required: 'Billing Address is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Billing Address" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. 123 Street Ave."
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="address_2"
        render={({ field: { onChange, value, onBlur } }): ReactElement => (
          <FormContainer label="Address 2">
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. Suite, Apt"
              onChange={onChange}
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
            <TextField value={value ?? ''} placeholder="Enter City" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="state"
        rules={{ required: 'State is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="State" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter State" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="zip"
        rules={{ required: 'Zip is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Zip" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Zip" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />
    </>
  );
};

export default AddCreditCardForm;
