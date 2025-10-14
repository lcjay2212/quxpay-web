import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { FormContainer, TextField } from 'component';
import { FC, ReactElement, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { useStateList } from 'store';
import { ValueLabelProps } from 'typings';
import {
  blockInvalidCardChars,
  blockInvalidExpiryChars,
  formatCardNumber,
  formatExpiryDate,
  reactSelectStyles,
  validateCardNumber,
  validateExpiryDate,
} from 'utils';

export const AddCreditCardForm: FC = () => {
  const { control } = useFormContext();
  const { data, isLoading } = useStateList();

  // Handler for card number formatting
  const handleCardNumberChange = useCallback((value: string, onChange: (value: string) => void): void => {
    const formatted = formatCardNumber(value);
    onChange(formatted);
  }, []);

  // Handler for expiry date formatting
  const handleExpiryDateChange = useCallback((value: string, onChange: (value: string) => void): void => {
    const formatted = formatExpiryDate(value);
    onChange(formatted);
  }, []);

  return (
    <>
      <Controller
        control={control}
        name="card_number"
        rules={{
          required: 'Card number is required',
          validate: (value): string | boolean => {
            const digitsOnly = value?.replace(/\D/g, '') || '';
            if (digitsOnly.length < 13) {
              return 'Card number must be at least 13 digits';
            }
            if (!validateCardNumber(value || '')) {
              return 'Invalid card number';
            }
            return true;
          },
        }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Card Number" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="1234 5678 9012 3456"
              onChange={(e): void => handleCardNumberChange(e.target.value, onChange)}
              onBlur={onBlur}
              onKeyDown={blockInvalidCardChars}
              maxLength={23} // 19 digits + 4 spaces
            />
          </FormContainer>
        )}
      />

      <Flex gap={4}>
        <Controller
          control={control}
          name="expiration_date"
          rules={{
            required: 'Expiry date is required',
            validate: (value): string | boolean => {
              if (!validateExpiryDate(value || '')) {
                return 'Invalid or expired date (MM/YY format required)';
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer label="Expiry Date" errorMessage={error?.message ?? ''}>
              <TextField
                value={value ?? ''}
                placeholder="MM/YY"
                onChange={(e): void => handleExpiryDateChange(e.target.value, onChange)}
                onBlur={onBlur}
                onKeyDown={blockInvalidExpiryChars}
                maxLength={5} // MM/YY format
              />
            </FormContainer>
          )}
        />
        <Controller
          control={control}
          name="card_code"
          rules={{
            required: 'Security Code is required',
            validate: (value): string | boolean => {
              const digitsOnly = value?.replace(/\D/g, '') || '';
              if (digitsOnly.length < 3 || digitsOnly.length > 4) {
                return 'Security code must be 3-4 digits';
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer label="Security Code" errorMessage={error?.message ?? ''}>
              <TextField
                value={value ?? ''}
                placeholder="CVV"
                onChange={(e): void => {
                  // Only allow digits for CVV
                  const digitsOnly = e.target.value.replace(/\D/g, '');
                  onChange(digitsOnly);
                }}
                onBlur={onBlur}
                onKeyDown={blockInvalidCardChars}
                maxLength={4}
              />
            </FormContainer>
          )}
        />
      </Flex>

      <Text textAlign="start" color="white" ml="1rem" mb="0.5rem">
        Name of Card
      </Text>
      <Flex gap={4}>
        <Controller
          control={control}
          name="firstname"
          rules={{ required: 'Firstname on Card is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer errorMessage={error?.message ?? ''}>
              <TextField value={value ?? ''} placeholder="Enter Firstname" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          )}
        />
        <Controller
          control={control}
          name="lastname"
          rules={{ required: 'Lastname is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer errorMessage={error?.message ?? ''}>
              <TextField value={value ?? ''} placeholder="Enter Lastname" onChange={onChange} onBlur={onBlur} />
            </FormContainer>
          )}
        />
      </Flex>

      <Controller
        control={control}
        name="address"
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
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer label="State" errorMessage={error?.message ?? ''}>
              <Select
                value={data?.find((option: ValueLabelProps) => option.value === value)}
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select State"
                isLoading={isLoading}
                options={data}
                onChange={(e: SingleValue<ValueLabelProps>): void => {
                  onChange(e?.value);
                }}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
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

      <Controller
        control={control}
        name="default"
        render={({ field: { onChange, value } }): ReactElement => (
          <FormContainer>
            <Flex alignItems="center" gap={3}>
              <Checkbox
                isChecked={value}
                onChange={(e): void => onChange(e.target.checked)}
                colorScheme="teal"
                size="lg"
              />
              <Text color="white" fontSize="md" fontWeight="medium">
                Set as default payment method
              </Text>
            </Flex>
          </FormContainer>
        )}
      />
    </>
  );
};
