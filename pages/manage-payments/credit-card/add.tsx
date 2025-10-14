import { Box, Button, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AddCreditCardForm, HeaderContainer } from 'component';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { notify, queryClient } from 'utils';

interface CreditCardFormData {
  firstname: string;
  lastname: string;
  card_number: string;
  card_code: string;
  expiration_date: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

interface AddCreditCardRequest {
  firstname: string;
  lastname: string;
  card_number: string;
  card_holder_name: string;
  card_code: string;
  expiration_date: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

interface ApiErrorData {
  errors?: Record<string, string>;
  status?: {
    message: string;
  };
}

const AddCreditCardPage: FC = () => {
  const methods = useForm<CreditCardFormData>();
  const router = useRouter();
  const { handleSubmit, reset } = methods;

  const { mutate: addCreditCard, isPending: addCreditCardLoading } = useMutation({
    mutationFn: (variable: AddCreditCardRequest) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wallet/add-credit-card`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      reset();
      notify('Credit Card Added Successfully', { status: 'success' });
      void router.push('/manage-payments');
      void queryClient.invalidateQueries({ queryKey: ['bandAndCreditDetails'] });
    },
    onError: (error: AxiosError) => {
      let message = '';
      const errorData = error.response?.data as ApiErrorData | undefined;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }
      notify(message || errorData?.status?.message || 'An error occurred', { status: 'error' });
    },
  });

  const onSubmit = (val: CreditCardFormData): void => {
    const addCreditCardVal: AddCreditCardRequest = {
      firstname: val.firstname,
      lastname: val.lastname,
      card_number: val.card_number.replace(/\s/g, ''),
      card_holder_name: `${val.firstname} ${val.lastname}`,
      card_code: val.card_code,
      expiration_date: val.expiration_date.replace('/', ''),
      address: val.address,
      address2: val.address2 || '',
      city: val.city,
      state: val.state,
      zip: val.zip,
      default: val.default,
    };

    addCreditCard(addCreditCardVal);
  };

  return (
    <HeaderContainer label="Add Credit Card" route="/manage-payments">
      <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AddCreditCardForm />

            <Flex mt="2rem" flexDirection="column">
              <Button type="submit" variant="primary" borderRadius="1rem" h="3.25rem" isLoading={addCreditCardLoading}>
                Add Credit Card
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </Box>
    </HeaderContainer>
  );
};

export default AddCreditCardPage;
