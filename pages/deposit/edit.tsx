import { Box, Button, Text } from '@chakra-ui/react';
import AddBankAccount from 'component/AddBankAccount/AddBankAccount';
import BankAccount from 'component/BankAccount/BankAccount';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_BANK_AND_CREDIT_CARD } from 'constants/api';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const EditDepositPage: FC = () => {
  const { data, isLoading: loading } = useQuery('bankAndCreditCard', FETCH_BANK_AND_CREDIT_CARD, errorHandler);

  const method = useForm();
  const { handleSubmit } = method;

  // eslint-disable-next-line no-console
  const onEdit = (val): void => console.log(val);
  const router = useRouter();

  return (
    <HeaderContainer label="Deposit" route="/dashboard">
      <>
        <Text color="white" fontSize="2rem" mt="2rem">
          Edit My Account
        </Text>
        <Box mt="1rem" mb="2rem" ml="1rem">
          <BankAccount bankDetails={data?.[0]?.payment?.bankAccount} loading={loading} />
        </Box>
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onEdit)}>
            <AddBankAccount />

            <Box textAlign="center">
              <Button type="submit" variant="primary" borderRadius="1rem" mt="2rem" w={350} h="3.25rem">
                Save Account
              </Button>

              <Button
                borderRadius="1rem"
                mt="1rem"
                w={350}
                h="3.25rem"
                _active={{ bg: 'white' }}
                onClick={(): void => void router.push('/deposit')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </FormProvider>
      </>
    </HeaderContainer>
  );
};

export default EditDepositPage;
