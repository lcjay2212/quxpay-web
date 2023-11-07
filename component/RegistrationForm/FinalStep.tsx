import { Flex, Text } from '@chakra-ui/react';
import { reactSelectStyles } from 'component/AddBankAccount';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { DAYS, MONTHS, YEARS } from 'mocks/month';
import Image from 'next/image';
import { AddBankIcons } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { useBankLists } from 'store/useBankLists';
import { useDebounce } from 'store/useDebounce';
import { blockInvalidChar } from 'utils/blockInvalidChar';
const FinalStep: FC = () => {
  const { control } = useFormContext();
  const [searchText, setSearchText] = useState('America');

  const debounceText = useDebounce(searchText, 1000);

  const { data, isLoading } = useBankLists(debounceText);
  const tempData = data?.map((item) => {
    return { label: item.name, value: item.name };
  });
  const listOfMonths = MONTHS.map((item) => item);

  const listOfDays = DAYS.map((item) => {
    return { label: `${item}`, value: `${item}` };
  });
  const listOfYears = YEARS.map((item) => {
    return { label: `${item}`, value: `${item}` };
  });

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
              placeholder="Enter Account Number"
              onKeyDown={blockInvalidChar}
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
              onKeyDown={blockInvalidChar}
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
                onChange={(e: { value?: string; label?: string }): void => {
                  onChange(e.value);
                }}
                onInputChange={(e: string): void => setSearchText(e)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />

      <Controller
        control={control}
        name="ssn"
        rules={{ required: 'Social Security Number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Social Security Number" errorMessage={error?.message ?? ''}>
            <TextField
              type="number"
              value={value ?? ''}
              onKeyDown={blockInvalidChar}
              placeholder="Enter SSN e.g. 123-45-6789"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="month"
        rules={{ required: 'Month is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer label="Select Month" errorMessage={error?.message ?? ''}>
              <Select
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select Month"
                options={listOfMonths}
                onChange={(e: { value: string; label: string }): void => onChange(e.value)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />

      <Flex gap={4}>
        <Controller
          control={control}
          name="day"
          rules={{ required: 'Day is required' }}
          render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
            return (
              <FormContainer label="Select Day" errorMessage={error?.message ?? ''}>
                <Select
                  onBlur={onBlur}
                  styles={reactSelectStyles}
                  placeholder="Select Day"
                  options={listOfDays}
                  onChange={(e: { value: string; label: string }): void => {
                    onChange(e.value);
                  }}
                  isClearable={true}
                />
              </FormContainer>
            );
          }}
        />

        <Controller
          control={control}
          name="year"
          rules={{ required: 'Year is required' }}
          render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
            return (
              <FormContainer label="Select Year" errorMessage={error?.message ?? ''}>
                <Select
                  onBlur={onBlur}
                  styles={reactSelectStyles}
                  placeholder="Select Year"
                  options={listOfYears}
                  onChange={(e: { value: string; label: string }): void => onChange(e.value)}
                  isClearable={true}
                />
              </FormContainer>
            );
          }}
        />
      </Flex>
    </>
  );
};

export default FinalStep;
