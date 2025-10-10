import { FormContainer, TextField } from 'component';
import { FC, ReactElement, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { useBankLists, useDebounce } from 'store';
import { blockInvalidChar, reactSelectStyles } from 'utils';

interface BankOption {
  label: string;
  value: string;
  routing_number: string;
}

interface BankAccountFormData {
  account_name: string;
  bank_name: string;
  routing_number: string;
  account_number: string;
}

export const AddBankAccount: FC = () => {
  const { control, watch, setValue } = useFormContext<BankAccountFormData>();
  const [searchText, setSearchText] = useState('America');

  const debounceText = useDebounce(searchText, 1000);

  const routingNumber = useDebounce(watch('routing_number'), 1000);
  const { data: bankList, isLoading } = useBankLists(debounceText, routingNumber);

  const finalData: BankOption[] | undefined = bankList?.map((item) => ({
    label: item.name,
    value: item.name,
    routing_number: item.routing_number,
  }));

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
        name="bank_name"
        rules={{ required: 'Bank Name is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Select Bank Name" errorMessage={error?.message ?? ''}>
            <Select
              onBlur={onBlur}
              styles={reactSelectStyles}
              placeholder="Select Bank Name"
              isLoading={isLoading}
              options={finalData}
              onChange={(selectedOption: SingleValue<BankOption>): void => {
                onChange(selectedOption?.value);
                setValue('routing_number', selectedOption?.routing_number ?? '');
              }}
              onInputChange={(inputValue: string): void => setSearchText(inputValue)}
              isClearable={true}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="routing_number"
        rules={{ required: 'Routing Number is required' }}
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
    </>
  );
};
