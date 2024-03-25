import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import Image from 'next/image';
import { QuxTokenIcon } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useBalance } from 'store/useBalance';
import { usePayBillsModall } from 'store/usePayBillsModall';

const PayBillsModal: FC = () => {
  const [visible, setVisible] = usePayBillsModall((state) => [state.visible, state.setVisible]);
  const { headerName, billerData } = usePayBillsModall((state) => ({
    headerName: state.headerName,
    billerData: state.billerData,
  }));
  const [step, setStep] = useState(1);
  const method = useForm({
    defaultValues: {
      email: '',
      biller_id: '',
      amount: 0,
      account_number: 0,
    },
  });
  const { handleSubmit, control } = method;
  const { balance, isLoading } = useBalance();

  console.log(billerData);

  const onSubmit = (val): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      console.log(val);
    }
  };

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDir="column" justifyContent="space-between" h="98vh">
                <Box>
                  <Flex justifyContent="space-between" alignItems="center" color="white">
                    <Flex mt="1rem" alignItems="center">
                      <ArrowBackIcon
                        mr="1rem"
                        cursor="pointer"
                        onClick={(): void => {
                          if (step === 2) {
                            setStep(1);
                          } else {
                            setVisible(false);
                          }
                        }}
                      />
                      <Text fontWeight="semibold">Pay bills to {headerName}</Text>
                    </Flex>
                  </Flex>
                  <Box textAlign="center">
                    {step === 1 && (
                      <Box textAlign="start" color="white" my="3rem">
                        <Text fontSize="1.2rem" fontWeight="semibold">
                          Available Balance
                        </Text>
                        <Flex alignItems="center">
                          <span>
                            <Image src={QuxTokenIcon} width={20} height={20} alt="Qux Token" />
                          </span>
                          {!isLoading ? (
                            <Text fontSize="1.2rem" fontWeight="semibold">
                              {balance.toFixed(2)}
                            </Text>
                          ) : (
                            <Spinner />
                          )}
                        </Flex>

                        <Box my="5rem">
                          <Controller
                            control={control}
                            name="amount"
                            rules={{ required: 'Amount is required' }}
                            render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                              <FormContainer errorMessage={error?.message ?? ''}>
                                <Input
                                  variant="flushed"
                                  placeholder="0.00"
                                  textAlign="center"
                                  fontSize="2rem"
                                  fontWeight="semibold"
                                  onChange={onChange}
                                  value={value}
                                  onBlur={onBlur}
                                  type="number"
                                />
                              </FormContainer>
                            )}
                          />
                        </Box>
                      </Box>
                    )}
                    {step === 2 && (
                      <Box my="5rem">
                        <Controller
                          control={control}
                          name="account_number"
                          rules={{ required: 'Account number is required' }}
                          render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                            <FormContainer errorMessage={error?.message ?? ''}>
                              <Input
                                variant="flushed"
                                placeholder="Customer Account Number"
                                textAlign="center"
                                fontSize="1rem"
                                fontWeight="semibold"
                                onChange={onChange}
                                value={value}
                                onBlur={onBlur}
                                type="number"
                              />
                            </FormContainer>
                          )}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box textAlign="center">
                  <Button type="submit" variant="primary" borderRadius="1rem" w={350} h="3.25rem">
                    Next
                  </Button>
                </Box>
              </Flex>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PayBillsModal;
