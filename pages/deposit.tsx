import { Box, Button, Divider } from '@chakra-ui/react';
import axios from 'axios';
import AddBankAccount from 'component/AddBankAccount/AddBankAccount';
import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { options } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { notify } from 'utils/notify';

const DepositPage: FC = () => {
  const method = useForm();
  const { handleSubmit, reset } = method;

  const { mutate, isLoading } = useMutation(
    (variable) => axios.post(`${STAGING_URL}/web/wallet/add-bank-account`, variable, options),
    {
      // eslint-disable-next-line no-console
      onSuccess: () => {
        reset();
        notify(`Succesfully Add new Bank Account`);
      },
      onError: ({ response }) => {
        notify(`${response.data?.errors?.account_number}`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => mutate(val);

  return (
    <HeaderContainer label="Deposit" route="/dashboard">
      <>
        <Deposit label="Deposit" url="web/wallet/charge" />

        <Divider mt="2rem" />

        <Box my="2rem" textAlign="center">
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddBankAccount />
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                mt="1rem"
                w={350}
                h="3.25rem"
                isLoading={isLoading}
              >
                Add New Bank
              </Button>
            </form>
          </FormProvider>
        </Box>
      </>
    </HeaderContainer>
  );
};

export default DepositPage;
