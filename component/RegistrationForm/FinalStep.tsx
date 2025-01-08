import { Box, chakra, Flex, FormLabel, Text } from '@chakra-ui/react';
import { FormContainer, TextField } from 'component';
import { DAYS, MONTHS, YEARS } from 'mocks/month';
import Image from 'next/image';
import { AddBankIconTwo, UploadIcon2 } from 'public/assets';
import { FC, ReactElement, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { useBankLists, useDebounce } from 'store';
import { blockInvalidChar, reactSelectStyles } from 'utils';

export const FinalStep: FC<{ type: string }> = ({ type }) => {
  const { control, watch, setValue } = useFormContext();
  const [searchText, setSearchText] = useState('America');

  const debounceText = useDebounce(searchText, 1000);
  const routingNumber = useDebounce(watch('routing_number'), 1000);

  const { data: bankList, isLoading } = useBankLists(debounceText, routingNumber);
  const { data: fullBankList } = useBankLists(debounceText);

  const finalData = fullBankList?.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  const listOfMonths = MONTHS.map((item) => item);

  const listOfDays = DAYS.map((item) => {
    return { label: `${item}`, value: `${item}` };
  });
  const listOfYears = YEARS.map((item) => {
    return { label: `${item}`, value: `${item}` };
  });

  useEffect(() => {
    if (bankList?.length === 1) {
      setValue('bank_name', bankList?.[0].name);
    }
  }, [bankList]);

  return (
    <>
      <Flex mb="1.5rem" alignItems="center">
        <Image src={AddBankIconTwo} height={50} width={60} alt="Add Bank Icon" />
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
        rules={{ required: 'Bank Routing Number is required' }}
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
              {bankList?.length === 1 ? (
                <TextField
                  type="text"
                  value={bankList?.[0].name}
                  placeholder="Enter Bank Name"
                  onKeyDown={blockInvalidChar}
                  onBlur={onBlur}
                />
              ) : (
                <Select
                  onBlur={onBlur}
                  styles={reactSelectStyles}
                  placeholder="Select Bank Name"
                  isLoading={isLoading}
                  options={finalData}
                  onChange={(e: SingleValue<ValueLabelProps>): void => {
                    onChange(e?.value);
                  }}
                  onInputChange={(e: string): void => setSearchText(e)}
                  isClearable={true}
                />
              )}
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
            <FormContainer label="Date of Birth" errorMessage={error?.message ?? ''}>
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
              <FormContainer errorMessage={error?.message ?? ''}>
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
              <FormContainer errorMessage={error?.message ?? ''}>
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
      {type !== 'regular' && (
        <Box mt="0.5rem">
          <Text color="white" fontSize="25px" mb="1.5rem">
            Upload Document
          </Text>

          <Controller
            control={control}
            name="passport"
            rules={{ required: 'Passport is required' }}
            render={({ field: { onChange }, fieldState: { error } }): ReactElement => (
              <FormContainer errorMessage={error?.message ?? ''}>
                <FormLabel fontSize="1rem" mb="0.5rem" color="white" ml="1rem">
                  <Flex gap={2} alignItems="center">
                    Passport or Second Form of ID
                    <span>
                      <Text
                        bg="gray"
                        borderRadius="50%"
                        w="20px"
                        h="20px"
                        textAlign="center"
                        fontSize="12px"
                        color="black"
                        fontWeight="bold"
                        pt="1px"
                        cursor="pointer"
                        onClick={(): void =>
                          void window.open(
                            'https://blog.quxpay.com/what-is-a-second-form-of-id/',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        ?
                      </Text>
                    </span>
                  </Flex>
                </FormLabel>
                <Box w="100%" my="0.5rem">
                  <chakra.input
                    type="file"
                    id="passport"
                    display="none"
                    onChange={(e): void => {
                      onChange(e.target.files);
                    }}
                  />
                  <chakra.label htmlFor="passport">
                    <Flex
                      w="100%"
                      h="55px"
                      placeContent="center"
                      cursor="pointer"
                      bg="btn.background-hover"
                      color="black"
                      transition="0.2s ease-in"
                      borderRadius="1rem"
                      _hover={{
                        bg: 'btn.background-base',
                        color: 'btn.text-base',
                      }}
                      fontSize="1rem"
                      fontWeight="semibold"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text mr="0.5rem">Upload File</Text>
                      <Image src={UploadIcon2} height={15} width={15} alt="Upload icon" placeholder="empty" />
                    </Flex>
                  </chakra.label>
                </Box>
              </FormContainer>
            )}
          />

          <Controller
            control={control}
            name="driver_license"
            rules={{ required: 'Driver License is required' }}
            render={({ field: { onChange }, fieldState: { error } }): ReactElement => (
              <FormContainer label="Driver License" errorMessage={error?.message ?? ''}>
                <Box w="100%" my="0.5rem">
                  <chakra.input
                    type="file"
                    id="driver_license"
                    display="none"
                    onChange={(e): void => {
                      onChange(e.target.files);
                    }}
                  />
                  <chakra.label htmlFor="driver_license">
                    <Flex
                      w="100%"
                      h="55px"
                      placeContent="center"
                      cursor="pointer"
                      bg="btn.background-hover"
                      color="black"
                      transition="0.2s ease-in"
                      borderRadius="1rem"
                      _hover={{
                        bg: 'btn.background-base',
                        color: 'btn.text-base',
                      }}
                      fontSize="1rem"
                      fontWeight="semibold"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text mr="0.5rem">Upload File</Text>
                      <Image src={UploadIcon2} height={15} width={15} alt="Upload icon" placeholder="empty" />
                    </Flex>
                  </chakra.label>
                </Box>
              </FormContainer>
            )}
          />
        </Box>
      )}
    </>
  );
};
