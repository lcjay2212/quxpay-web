import { Flex, Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { startCase } from 'lodash';
import Image from 'next/image';
import { AddBankIcons } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
const FinalStep: FC = () => {
  const { control } = useFormContext();
  return (
    <>
      <Flex mb="1.5rem">
        <Image src={AddBankIcons} alt="Add Bank Icon" />
        <Text ml="1rem" color="white" fontSize="1.25rem">
          Add New Bank Account
        </Text>
      </Flex>

      <Controller
        control={control}
        name="bank_nickname"
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
              placeholder="Enter Routing Number"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="account_name"
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

      <Controller
        control={control}
        name="ssn"
        rules={{ required: 'Social Security Number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Social Security Number" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter SSN e.g. 123-45-6789"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />
    </>
  );
};

export default FinalStep;
