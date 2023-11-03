import { Box, Button, Divider, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import axios from 'axios';
import BankAccount from 'component/BankAccount/BankAccount';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_BANK_AND_CREDIT_CARD, options } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const DeleteAccount: FC = () => {
  const router = useRouter();
  const { data, isLoading: loading } = useQuery('bankAndCreditCard', FETCH_BANK_AND_CREDIT_CARD, errorHandler);
  const [radioValue, setRadioValue] = useState('');
  const [paymentId, setPaymentId] = useAccountPaymentId(({ paymentId, setPaymentId }) => [paymentId, setPaymentId]);

  const { mutate, isLoading } = useMutation(
    (variable) => axios.post(`${STAGING_URL}/web/bankaccount/remove`, variable, options),
    {
      onSuccess: () => {
        notify(`Successfully Remove`);
        void router.push('/purchase');
      },
      onError: () => {
        notify(`ERROR`, { status: 'error' });
      },
    }
  );

  return (
    <Box h="100vh" overflow="hidden">
      <HeaderContainer label="Purchase" route="/dashboard">
        <Box>
          <Box maxH={600}>
            <Text color="white" fontSize="2rem" mt="2rem">
              My Account
            </Text>

            <RadioGroup onChange={setRadioValue} value={radioValue}>
              {data?.payments?.map((item, index) => (
                <>
                  <Flex justifyContent="space-between" key={index}>
                    <Box mt="1rem">
                      <BankAccount
                        bankName={item?.bank_name}
                        name={item?.account_name}
                        accountNumber={item?.account_number}
                        loading={loading}
                      />
                    </Box>
                    <Radio
                      value={`${index + 1}`}
                      colorScheme="teal"
                      onChange={(): void => {
                        setPaymentId(item.payment_profile_id);
                      }}
                    />
                  </Flex>
                  <Divider mt="1rem" />
                </>
              ))}
            </RadioGroup>
          </Box>

          <Box textAlign="center">
            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              mt="2rem"
              w={350}
              h="3.25rem"
              isLoading={isLoading}
              onClick={(): void =>
                mutate({
                  payment_profile_id: paymentId,
                } as any)
              }
            >
              Delete Selected Account
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
        </Box>
      </HeaderContainer>
    </Box>
  );
};

export default DeleteAccount;
