import { Box, Button, chakra, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { BankIcon, UploadIcon2 } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useUser } from 'store/useUser';
import { useVerifyModal } from 'store/useVerifyModal';
import { blockInvalidChar, notify } from 'utils';

export const VerifyModal: FC = () => {
  const { user } = useUser();
  const [visible, setVisible] = useVerifyModal(({ visible, setVisible }) => [visible, setVisible]);
  const method = useForm();
  const { handleSubmit, control, reset } = method;

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/verify/user`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          'QuxPay-Web': 1,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        notify(`Success!`);
        setVisible(false);
      },
      onError: ({ response }) => {
        notify(`${response?.data?.message}`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => {
    const formData = new FormData();

    formData.append('user_type', user?.corporate ? 'corporate' : 'user');
    formData.append('first_name', val.first_name);
    formData.append('last_name', val.last_name);
    formData.append('ssn', val.ssn);

    if (!user?.corporate) {
      mutate(formData as any);
    } else {
      formData.append('passport', val.passport[0]);
      formData.append('driver_license', val.driver_license[0]);
      mutate(formData as any);
    }
  };
  return (
    <Modal
      isOpen={visible}
      onClose={(): void => {
        setVisible(visible);
        reset();
      }}
      size={{ base: 'full', md: '3xl' }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="4rem">
            <Image src={BankIcon} height={90} width={90} alt="Qux Logo" placeholder="empty" />

            <Text color="white" textAlign="center" fontWeight="bold" fontSize="1.5rem">
              <chakra.span color="primary">N</chakra.span>
              ow you're leveling
              <br /> up with QUXPay™!
            </Text>

            <Text my="1rem" fontSize="10px" textAlign="center" color="white">
              In order to complete setting up your account and continue using QUXPay™,
              <br /> please enter your information. Remember that all information will
              <br /> follow the strictest form of our privacy policy.
            </Text>
          </Flex>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDir="column" justifyContent="space-between">
                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: 'First Name is required' }}
                  render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                    <FormContainer label="First Name" errorMessage={error?.message ?? ''}>
                      <TextField
                        value={value ?? ''}
                        placeholder="Enter your first name"
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormContainer>
                  )}
                />

                <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: 'Last Name is required' }}
                  render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                    <FormContainer label="Last Name" errorMessage={error?.message ?? ''}>
                      <TextField
                        value={value ?? ''}
                        placeholder="Enter your last name"
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormContainer>
                  )}
                />

                <Controller
                  control={control}
                  name="ssn"
                  rules={{ required: 'Social Security Number is required' }}
                  render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                    <FormContainer label="Social Security Number" errorMessage={error?.message ?? ''}>
                      <TextField
                        type="number"
                        value={value ?? ''}
                        onKeyDown={blockInvalidChar}
                        placeholder="Enter SSN e.g. 123-45-6789"
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormContainer>
                  )}
                />

                {user?.corporate && (
                  <Box mt="0.5rem">
                    <Text color="white" fontSize="25px" mb="1.5rem">
                      Upload Document
                    </Text>

                    <Controller
                      control={control}
                      name="passport"
                      rules={{ required: 'Passport is required' }}
                      render={({ field: { onChange }, fieldState: { error } }): ReactElement => (
                        <FormContainer label="Passport" errorMessage={error?.message ?? ''}>
                          <Box w="100%" my="0.5rem">
                            <chakra.input
                              type="file"
                              id="passport"
                              display="none"
                              onChange={(e): void => {
                                onChange(e.target.files);
                              }}
                            />
                            <chakra.label htmlFor="passport">
                              <Flex
                                w="100%"
                                h="55px"
                                placeContent="center"
                                cursor="pointer"
                                bg="btn.background-hover"
                                color="black"
                                transition="0.2s ease-in"
                                borderRadius="1rem"
                                _hover={{
                                  bg: 'btn.background-base',
                                  color: 'btn.text-base',
                                }}
                                fontSize="1rem"
                                fontWeight="semibold"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Text mr="0.5rem">Upload File</Text>
                                <Image src={UploadIcon2} height={15} width={15} alt="Upload icon" placeholder="empty" />
                              </Flex>
                            </chakra.label>
                          </Box>
                        </FormContainer>
                      )}
                    />

                    <Controller
                      control={control}
                      name="driver_license"
                      rules={{ required: 'Driver License is required' }}
                      render={({ field: { onChange }, fieldState: { error } }): ReactElement => (
                        <FormContainer label="Driver License" errorMessage={error?.message ?? ''}>
                          <Box w="100%" my="0.5rem">
                            <chakra.input
                              type="file"
                              id="driver_license"
                              display="none"
                              onChange={(e): void => {
                                onChange(e.target.files);
                              }}
                            />
                            <chakra.label htmlFor="driver_license">
                              <Flex
                                w="100%"
                                h="55px"
                                placeContent="center"
                                cursor="pointer"
                                bg="btn.background-hover"
                                color="black"
                                transition="0.2s ease-in"
                                borderRadius="1rem"
                                _hover={{
                                  bg: 'btn.background-base',
                                  color: 'btn.text-base',
                                }}
                                fontSize="1rem"
                                fontWeight="semibold"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Text mr="0.5rem">Upload File</Text>
                                <Image src={UploadIcon2} height={15} width={15} alt="Upload icon" placeholder="empty" />
                              </Flex>
                            </chakra.label>
                          </Box>
                        </FormContainer>
                      )}
                    />
                  </Box>
                )}

                <Box textAlign="center" my="2rem">
                  <Button type="submit" variant="primary" borderRadius="1rem" w="100%" h="3.5rem" isLoading={isLoading}>
                    Continue
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
