import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { SetScheduleModal } from 'component/Modal';
import { TextField } from 'component/TextField';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import Image from 'next/image';
import { BillsIcon } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSchedulePayBillModal, useSetScheduleModal } from 'store';

export const ScheduleBiller: FC<{
  id?: number;
  startDate?: any;
  setStartDate?: any;
  endDate?: any;
  setEndDate?: any;
  filter?: any;
  setFilter?: any;
}> = ({ startDate, setStartDate, endDate, setEndDate, filter, setFilter }) => {
  const { billerData } = useSchedulePayBillModal((state) => ({
    billerData: state.billerData,
  }));
  const { control, watch } = useFormContext();
  const setVisible = useSetScheduleModal((state) => state.setVisible);
  return (
    <Box my="1rem">
      <Flex justifyContent="flex-start" alignItems="center">
        <Flex justifyContent="center" width="auto" height={50}>
          <Image
            src={BillsIcon}
            width={100}
            height={100}
            alt="Biller"
            style={{
              objectFit: 'fill',
            }}
            placeholder="empty"
          />
        </Flex>
        <Text color="white" fontWeight="semibold" fontSize="14px">
          {billerData?.biller || billerData?.biller_name}
        </Text>
      </Flex>

      <Flex gap={8} justifyContent="space-between" alignItems="center" color="white">
        <Flex textAlign="start" flexDir="column" fontSize="12px" w={300}>
          <Text>Amount</Text>
          <Text>Service Fee: $1.00</Text>
        </Flex>

        <Controller
          control={control}
          name="amount"
          rules={{ required: 'Account number is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer errorMessage={error?.message ?? ''}>
              <Input
                placeholder="0.00"
                textAlign="end"
                fontSize="2rem"
                fontWeight="semibold"
                onChange={(e): void => onChange(+e.target.value)}
                value={value}
                onBlur={onBlur}
                type="number"
                borderRadius="xl"
                height={50}
                mb="1rem"
                borderColor="white"
              />
            </FormContainer>
          )}
        />
      </Flex>

      <Box mt="3rem" mb="2rem">
        <Controller
          control={control}
          name="account_number"
          rules={{ required: 'Account number is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
            <FormContainer errorMessage={error?.message ?? ''} label="9-10 Account Number">
              <TextField
                value={value ?? billerData?.account_number}
                placeholder="Enter 9-10 Account Number"
                onChange={onChange}
                onBlur={onBlur}
              />
            </FormContainer>
          )}
        />
      </Box>

      <Controller
        control={control}
        name="account_name"
        rules={{ required: 'Account Nickname is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer errorMessage={error?.message ?? ''} label="Account Nickname">
            <TextField
              value={value ?? billerData?.account_name}
              placeholder="Enter Account Nickname"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Flex
        bg="blue.100"
        color="white"
        borderRadius="20px"
        p="1rem"
        mt="3rem"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={(): void => setVisible(true)}
      >
        {watch('date') || !billerData ? (
          <Flex flexDir="column" fontSize="12px" textAlign="start">
            <Text>Start: {dayjs(watch('date')).format('MMMM DD,YYYY') || billerData?.payment_date}</Text>
            {watch('frequency') && <Text>Frequency: {startCase(watch('frequency')) || billerData?.frequency}</Text>}
          </Flex>
        ) : (
          <Text>Input Payment Schedule</Text>
        )}
        <ChevronRightIcon w={30} h={30} />
      </Flex>

      <SetScheduleModal
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        filter={filter}
        setFilter={setFilter}
      />
    </Box>
  );
};
