import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AddCreditCardForm, CreditCardDisplay, DeleteCreditCardModal, HeaderContainer } from 'component';
import { FETCH_BANK_AND_CREDIT_DETAILS } from 'constants/api';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDeleteCreditCardModal } from 'store/useDeleteCreditCardModal';
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

interface EditCreditCardRequest {
  payment_profile_id: string;
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

interface CreditCardData {
  customerPaymentProfileId: string;
  defaultPaymentProfile: boolean;
  payment: {
    billingInfo: {
      address: string;
      city: string;
      country: string;
      firstName: string;
      lastName: string;
      state: string;
      zip: string;
    };
    creditCard: {
      cardNumber: string;
      expirationDate: string;
      cardType: string;
      nameOnCard: string;
    };
    payment_type: string;
  };
}

const EditCreditCardPage: FC = () => {
  const methods = useForm<CreditCardFormData>();
  const router = useRouter();
  const { handleSubmit, reset } = methods;
  const { id } = router.query;
  const openDeleteModal = useDeleteCreditCardModal((e) => e.openModal);

  // Fetch credit card data
  const { data: creditCardData, isLoading } = useQuery({
    queryKey: ['bandAndCreditDetails'],
    queryFn: FETCH_BANK_AND_CREDIT_DETAILS,
    enabled: !!id,
  });

  // Find the specific credit card to edit
  const currentCard = creditCardData?.credit_card?.find((card: CreditCardData) => card.customerPaymentProfileId === id);

  // Pre-fill form with existing data
  useEffect(() => {
    if (currentCard) {
      const cardData = currentCard.payment.creditCard;
      const billingData = currentCard.payment.billingInfo;

      // Format expiration date from YYYYMM to MM/YY
      const expDate = cardData.expirationDate;
      const formattedExpDate = expDate ? `${expDate.slice(2, 4)}/${expDate.slice(0, 2)}` : '';

      reset({
        firstname: billingData.firstName || '',
        lastname: billingData.lastName || '',
        card_number: cardData.cardNumber || '',
        card_code: '', // Security code is never stored
        expiration_date: formattedExpDate,
        address: billingData.address || '',
        address2: '', // Not typically stored
        city: billingData.city || '',
        state: billingData.state || '',
        zip: billingData.zip || '',
        default: currentCard.defaultPaymentProfile,
      });
    }
  }, [currentCard, reset]);

  // Edit credit card mutation
  const { mutate: editCreditCard, isPending: editCreditCardLoading } = useMutation({
    mutationFn: (variable: EditCreditCardRequest) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/wallet/update-card`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify('Credit Card Updated Successfully', { status: 'success' });
      void router.push('/manage-payments');
      void queryClient.invalidateQueries({ queryKey: ['bandAndCreditDetails'] });
    },
    onError: (error: AxiosError) => {
      let message = '';
      const errorData = error.response?.data as any;

      // Check for direct message field first (most common case)
      if (errorData?.message) {
        message = errorData.message;
      }
      // Check for errors object (validation errors)
      else if (errorData?.errors) {
        Object.values(errorData.errors).forEach((errorMessage) => {
          message += errorMessage;
        });
      }
      // Check for status message
      else if (errorData?.status?.message) {
        message = errorData.status.message;
      }

      notify(message || 'An error occurred', { status: 'error' });
    },
  });

  const onSubmit = (val: CreditCardFormData): void => {
    if (!id || !currentCard) return;

    const editCreditCardVal: EditCreditCardRequest = {
      payment_profile_id: id as string,
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

    editCreditCard(editCreditCardVal);
  };

  const handleDelete = (): void => {
    if (!id) return;
    openDeleteModal(id as string);
  };

  if (isLoading) {
    return (
      <HeaderContainer label="Edit Credit Card" route="/manage-payments">
        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <Text color="gray.600">Loading credit card details...</Text>
        </Box>
      </HeaderContainer>
    );
  }

  if (!currentCard) {
    return (
      <HeaderContainer label="Edit Credit Card" route="/manage-payments">
        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <Text color="red.500">Credit card not found</Text>
          <Button
            mt={4}
            onClick={(): void => {
              void router.push('/manage-payments');
            }}
          >
            Back to Manage Payments
          </Button>
        </Box>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer label="Manage Card" route="/manage-payments">
      <>
        {/* Credit Card Display */}
        {currentCard && (
          <Box px="1rem" mb="2rem">
            <CreditCardDisplay
              cardNumber={currentCard.payment.creditCard.cardNumber}
              cardType={currentCard.payment.creditCard.cardType}
              expirationDate={currentCard.payment.creditCard.expirationDate}
              nameOnCard={currentCard.payment.creditCard.nameOnCard}
              isDefault={currentCard.defaultPaymentProfile}
            />
          </Box>
        )}

        <Box textAlign="center" overflow="hidden" px="1rem" mb="2rem">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AddCreditCardForm />

              <Flex mt="2rem" flexDirection="column" gap={4}>
                <Button
                  type="submit"
                  variant="primary"
                  borderRadius="1rem"
                  h="3.25rem"
                  isLoading={editCreditCardLoading}
                  colorScheme="teal"
                >
                  Update Credit Card
                </Button>

                <Button variant="delete" borderRadius="1rem" h="3.25rem" onClick={handleDelete}>
                  Delete Card
                </Button>
              </Flex>
            </form>
          </FormProvider>
        </Box>

        <DeleteCreditCardModal />
      </>
    </HeaderContainer>
  );
};

export default EditCreditCardPage;
