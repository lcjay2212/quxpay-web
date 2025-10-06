import { FormContainer, HeaderContainer, TextField, TransactionHistoryFilterModal } from 'component';
import { FC, ReactElement, useState } from 'react';
// import { usePrivatekey } from 'store';
import { CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { SuccessModal } from 'component/Modal/SuccessModal';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { DATE_FILTER, TRANSACTION_FILTER } from 'mocks/transactionFilter';
import DatePicker from 'react-datepicker';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSuccessModal, useTransactionHistoryFilterModal } from 'store';
import { notify } from 'utils';

type DateOption = 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_6_months';
const TransactionDownloadPage: FC = () => {
  const method = useForm();
  const { control, handleSubmit } = method;
  const setVisible = useTransactionHistoryFilterModal((state) => state.setVisible);
  const [id, setId] = useState('');
  const { setVisible: setSuccessVisible, setMessage } = useSuccessModal();

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wallet/download-transactions`, {
        params: variable,
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      setSuccessVisible(true);
      setMessage(data?.data?.message || 'You will received an email for the downloadable file.');
    },
    onError: () => {
      notify('Failed to export file', { status: 'error' });
    },
  });

  const onDownload = (val): void => {
    const calculateEndDate = (dateOption: DateOption): string | null => {
      switch (dateOption) {
        case 'last_7_days':
          return dayjs().subtract(7, 'day').format('YYYY-MM-DD');
        case 'last_30_days':
          return dayjs().subtract(30, 'day').format('YYYY-MM-DD');
        case 'last_3_months':
          return dayjs().subtract(3, 'months').format('YYYY-MM-DD');
        case 'last_6_months':
          return dayjs().subtract(6, 'months').format('YYYY-MM-DD');
        default:
          return null;
      }
    };

    const endDate = val.end_date || calculateEndDate(val.date);
    const fromDate = val.from_date || dayjs().format('YYYY-MM-DD');

    mutate({
      date: val.date,
      end_date: endDate,
      from_date: fromDate,
      transaction_type: val.transaction_type,
    } as any);
  };

  return (
    <HeaderContainer label="Transactions" route="/dashboard">
      <>
        <Box mx="2rem" my="1rem">
          <Text color="white" fontSize="18px" fontWeight="bold">
            Download transaction history
          </Text>
          <Text fontSize="14px">
            Create a custom CSV transaction history for download. This will email you a complete csv file once it is
            generated.
          </Text>
        </Box>

        <Box background="#10101F" h="80vh" py="1rem" px="2rem" mt="2rem">
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onDownload)}>
              <Flex flexDirection="column" justifyContent="space-between" height="60vh">
                <Box>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="Select a date range">
                        <TextField
                          value={capitalize(value?.replace(/_/g, ' '))}
                          placeholder="Select option"
                          onClick={(): void => {
                            setId('date');
                            setVisible(true);
                          }}
                          onBlur={onBlur}
                          customRightElement={
                            <ChevronDownIcon color="white" mt="0.5rem" mr="1rem" height={8} width={8} />
                          }
                        />
                        {id === 'date' && (
                          <TransactionHistoryFilterModal title="Date" data={DATE_FILTER} setValue={onChange} />
                        )}
                      </FormContainer>
                    )}
                  />

                  <Controller
                    control={control}
                    name="from_date"
                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="From">
                        <TextField
                          value={value}
                          placeholder="Select a start date"
                          onChange={onChange}
                          onBlur={onBlur}
                          customRightElement={
                            <Box>
                              <DatePicker
                                customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                                selected={value ? dayjs(value).date() : value}
                                dropdownMode="select"
                                popperPlacement="top-end"
                                popperProps={{ strategy: 'fixed' }}
                                onChange={(a: Date): void => {
                                  onChange(dayjs(a).format('YYYY-MM-DD'));
                                }}
                                showYearDropdown
                              />
                            </Box>
                          }
                        />
                      </FormContainer>
                    )}
                  />

                  <Controller
                    control={control}
                    name="end_date"
                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="To">
                        <TextField
                          value={value}
                          placeholder="Select an end date"
                          onChange={onChange}
                          onBlur={onBlur}
                          customRightElement={
                            <Box>
                              <DatePicker
                                customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                                selected={value ? dayjs(value).date() : value}
                                dropdownMode="select"
                                popperPlacement="top-end"
                                popperProps={{ strategy: 'fixed' }}
                                onChange={(a: Date): void => {
                                  onChange(dayjs(a).format('YYYY-MM-DD'));
                                }}
                                showYearDropdown
                              />
                            </Box>
                          }
                        />
                      </FormContainer>
                    )}
                  />

                  <Controller
                    control={control}
                    name="transaction_type"
                    rules={{ required: 'Transaction Type is required' }}
                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="Transaction Type">
                        <TextField
                          value={capitalize(value?.replace(/_/g, ' '))}
                          placeholder="Select type"
                          onClick={(): void => {
                            setId('transaction');
                            setVisible(true);
                          }}
                          onBlur={onBlur}
                          customRightElement={
                            <ChevronDownIcon color="white" mt="0.5rem" mr="1rem" height={8} width={8} />
                          }
                        />
                        {id === 'transaction' && (
                          <TransactionHistoryFilterModal
                            title="Transaction"
                            data={TRANSACTION_FILTER}
                            setValue={onChange}
                          />
                        )}
                      </FormContainer>
                    )}
                  />
                </Box>

                <Flex justifyContent="center">
                  <Button isLoading={isPending} type="submit" variant="primary" borderRadius="1rem" w={350} h="3.25rem">
                    Download
                  </Button>
                </Flex>
              </Flex>
            </form>
          </FormProvider>
        </Box>

        <SuccessModal />
      </>
    </HeaderContainer>
  );
};

export default TransactionDownloadPage;
