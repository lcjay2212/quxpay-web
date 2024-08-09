import { FormContainer, HeaderContainer, TextField, TransactionHistoryFilterModal } from 'component';
import { FC, ReactElement, useState } from 'react';
// import { usePrivatekey } from 'store';
import { CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { DATE_FILTER, TRANSACTION_FILTER } from 'mocks/transactionFilter';
import DatePicker from 'react-datepicker';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useTransactionHistoryFilterModal } from 'store';
import { notify } from 'utils';
const TransactionDownloadPage: FC = () => {
  const method = useForm();
  const { control, handleSubmit } = method;
  const setVisible = useTransactionHistoryFilterModal((state) => state.setVisible);
  const [id, setId] = useState('');

  const { mutate, isLoading } = useMutation(
    () =>
      axios.get(`${STAGING_URL}/web/wallet/download-transactions`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        const link = document.createElement('a');
        link.href = data.data.url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      onError: () => {
        notify(`Failed to export file`, { status: 'error' });
      },
    }
  );

  const onDownload = (val): void => {
    mutate(val);
  };

  return (
    <HeaderContainer label="Transactions" route="/dashboard">
      <>
        <Box mx="2rem" my="1rem">
          <Text color="white" fontSize="18px" fontWeight="bold">
            Download transaction history
          </Text>
          <Text fontSize="14px">Lorem ipsum dolor sit amet, consectetur adipiscing Lorem ipsum dolor sit amet.</Text>
        </Box>

        <Box background="#10101F" h="80vh" py="1rem" px="2rem" mt="2rem">
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onDownload)}>
              <Flex flexDirection="column" justifyContent="space-between" height="60vh">
                <Box>
                  <Controller
                    control={control}
                    name="date"
                    rules={{ required: 'Date Range is required' }}
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
                          <TransactionHistoryFilterModal
                            title="Date"
                            data={DATE_FILTER}
                            setValue={onChange}
                            value={value}
                          />
                        )}
                      </FormContainer>
                    )}
                  />

                  <Controller
                    control={control}
                    name="from_date"
                    rules={{ required: 'Date is required' }}
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
                    rules={{ required: 'Date is required' }}
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
                            value={value}
                          />
                        )}
                      </FormContainer>
                    )}
                  />
                </Box>

                <Flex justifyContent="center">
                  <Button isLoading={isLoading} type="submit" variant="primary" borderRadius="1rem" w={350} h="3.25rem">
                    Download
                  </Button>
                </Flex>
              </Flex>
            </form>
          </FormProvider>
        </Box>
      </>
    </HeaderContainer>
  );
};

export default TransactionDownloadPage;
