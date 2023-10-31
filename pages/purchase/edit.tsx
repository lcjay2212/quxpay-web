import { Box, Button, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import BankAccount from 'component/BankAccount/BankAccount';
import { FormContainer } from 'component/FormInput';
import HeaderContainer from 'component/Header/HeaderContainer';
import { options, SHOW_BANK_ACCOUNT_DETAILS } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import { blockInvalidChar } from 'utils/blockInvalidChar';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const EditDepositPage: FC = () => {
  const paymentId = useAccountPaymentId((e) => e.paymentId);
  const router = useRouter();
  const { data, isLoading: loading } = useQuery(
    ['bankAndCreditCard', paymentId],
    SHOW_BANK_ACCOUNT_DETAILS,
    errorHandler
  );

  const { handleSubmit, register } = useForm({
    defaultValues: data?.account,
  });

  const { mutate, isLoading } = useMutation(
    (variable) => axios.post(`${STAGING_URL}/web/bankaccount/update`, variable, options),
    {
      onSuccess: () => {
        notify(`Successfully Update`);
        void router.push('/purchase');
      },
      onError: () => {
        notify(`ERROR`, { status: 'error' });
      },
    }
  );

  // eslint-disable-next-line no-console
  const onEdit = (val): void => {
    const formData = new FormData();
    formData.append('payment_profile_id', paymentId);
    formData.append('account_name', val.account_name || data?.account.account_name);
    formData.append('routing_number', val.routing_number || data?.account.routing_number);
    formData.append('account_number', val.account_number || data?.account.account_number);
    formData.append('bank_name', val.bank_name || data?.account.bank_name);
    mutate(formData as any);
  };

  return (
    <HeaderContainer label="Purchase" route="/dashboard">
      <>
        <Text color="white" fontSize="2rem" mt="2rem">
          Edit My Account
        </Text>
        <Box mt="1rem" mb="2rem" ml="1rem">
          <BankAccount
            bankName={data?.account?.bank_name}
            name={data?.account?.account_name}
            accountNumber={data?.account?.account_number}
            loading={loading}
          />
        </Box>
        <FormContainer label="Bank Account Nickname">
          <Input
            placeholder="Enter Account Nickname"
            bg={loading ? 'lightgray' : 'gray.200'}
            border="1px solid #cccccc"
            borderRadius="16px"
            boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
            height="3.5rem"
            color="white"
            _placeholder={{
              color: 'gray',
            }}
            _disabled={{
              borderColor: 'white',
              bg: 'white',
              opacity: '0.4',
              cursor: 'not-allowed',
            }}
            _focus={{
              border: `2px solid`,
              borderColor: 'primary',
              bg: 'black',
            }}
            defaultValue={data?.account?.account_name}
            {...register('account_name')}
          />
        </FormContainer>

        <FormContainer label="Bank Account Number">
          <Input
            placeholder="Enter Account Number"
            bg={loading ? 'lightgray' : 'gray.200'}
            border="1px solid #cccccc"
            borderRadius="16px"
            boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
            height="3.5rem"
            color="white"
            _placeholder={{
              color: 'gray',
            }}
            _disabled={{
              borderColor: 'white',
              bg: 'white',
              opacity: '0.4',
              cursor: 'not-allowed',
            }}
            _focus={{
              border: `2px solid`,
              borderColor: 'primary',
              bg: 'black',
            }}
            onKeyDown={blockInvalidChar}
            defaultValue={data?.account?.account_number}
            {...register('account_number')}
          />
        </FormContainer>

        <FormContainer label="Bank Routing Number">
          <Input
            placeholder="Enter Routing Number"
            bg={loading ? 'lightgray' : 'gray.200'}
            border="1px solid #cccccc"
            borderRadius="16px"
            boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
            height="3.5rem"
            color="white"
            _placeholder={{
              color: 'gray',
            }}
            _disabled={{
              borderColor: 'white',
              bg: 'white',
              opacity: '0.4',
              cursor: 'not-allowed',
            }}
            _focus={{
              border: `2px solid`,
              borderColor: 'primary',
              bg: 'black',
            }}
            onKeyDown={blockInvalidChar}
            defaultValue={data?.account?.routing_number}
            {...register('routing_number')}
          />
        </FormContainer>

        <FormContainer label="Select Bank Name">
          <Input
            placeholder="Enter Bank Name"
            bg={loading ? 'lightgray' : 'gray.200'}
            border="1px solid #cccccc"
            borderRadius="16px"
            boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
            height="3.5rem"
            color="white"
            _placeholder={{
              color: 'gray',
            }}
            _disabled={{
              borderColor: 'white',
              bg: 'white',
              opacity: '0.4',
              cursor: 'not-allowed',
            }}
            _focus={{
              border: `2px solid`,
              borderColor: 'primary',
              bg: 'black',
            }}
            defaultValue={data?.account?.bank_name}
            {...register('bank_name')}
          />
        </FormContainer>

        <Box textAlign="center">
          <Button
            type="submit"
            variant="primary"
            borderRadius="1rem"
            mt="2rem"
            w={350}
            h="3.25rem"
            onClick={handleSubmit(onEdit)}
            isLoading={isLoading}
          >
            Save Account
          </Button>

          <Button
            borderRadius="1rem"
            mt="1rem"
            w={350}
            h="3.25rem"
            _active={{ bg: 'white' }}
            onClick={(): void => void router.push('/purchase')}
          >
            Cancel
          </Button>
        </Box>
      </>
    </HeaderContainer>
  );
};

export default EditDepositPage;
