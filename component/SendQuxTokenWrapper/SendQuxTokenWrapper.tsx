import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FormContainer, TextField } from 'component';
import { FETCH_FRIEND_LIST } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddFriendIcon, SendQuxCash } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDecryptedCoreBalance } from 'store/useDecryptedCoreBalance';
import { notify } from 'utils';
import { encryptData } from 'utils/encryptData';

export const SendQuxTokenWrapper: FC = () => {
  const router = useRouter();
  const method = useForm();

  const { control, handleSubmit } = method;
  const [radioValue, setRadioValue] = useState('');
  const [successTrigger, setSuccessTrigger] = useState(false);
  const [amount, setAmount] = useState(0);

  const { data, isLoading: loading, refetch } = useQuery({ queryKey: ['friendList'], queryFn: FETCH_FRIEND_LIST });
  const [sentToDetail, setSetToDetail] = useState<{
    name: string;
    username: string;
    email: string;
  }>(data?.[0] || {});

  const [payload, setPayload] = useState();
  const coreBalance = useDecryptedCoreBalance((e) => e.coreBalance);

  const { mutate: updateMainFile, isPending: updateMainFileLoading } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/encryption/updated/main-file`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      setSuccessTrigger(true);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message, { status: 'error' });
    },
  });

  const { mutate: validate, isPending: validating } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/validate/send-token`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      const content = JSON.stringify({
        send_tokens: [payload],
      });

      if (coreBalance) {
        const encryptedData = encryptData(content, coreBalance, 'balance');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateMainFile(encryptedData as any);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(response.data.errors).forEach(([_, message]) => {
        notify(` ${message}`, { status: 'error' });
      });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/friends/add`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      void refetch();
      setRadioValue('');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message, { status: 'error' });
    },
  });

  const onDeposit = (val): void => {
    if (radioValue !== `${data?.length + 1}`) {
      validate({ ...val, type: 'tag_token' });
      setPayload({ ...val, type: 'tag_token' });
    } else {
      mutate(val);
    }
  };

  return (
    <Box textAlign="center" overflow="hidden" px="1rem">
      {!successTrigger ? (
        <Box mb="2rem">
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onDeposit)}>
              <Controller
                control={control}
                name="amount"
                rules={{
                  required: radioValue !== `${data?.length + 1}` ? 'Amount is required' : false,
                  validate: (value) => value >= 20 || 'Amount must be at least $20',
                }}
                render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                  <FormContainer label="Minimum Amount $20" errorMessage={error?.message ?? ''} place="end">
                    <TextField
                      type="number"
                      value={value ?? ''}
                      placeholder="Enter Amount"
                      onChange={(e): void => {
                        onChange(e.target.value);
                        setAmount(+e.target.value);
                      }}
                      onBlur={onBlur}
                      formNoValidate
                    />
                  </FormContainer>
                )}
              />

              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value, onBlur } }): ReactElement => (
                  <FormContainer>
                    <Textarea
                      bg={loading ? 'lightgray' : '#10101F'}
                      border="1px solid #4D4D6B"
                      borderRadius="16px"
                      height="3.5rem"
                      color="white"
                      _placeholder={{
                        color: 'gray',
                      }}
                      _focus={{
                        border: `2px solid`,
                        borderColor: 'primary',
                        bg: 'black',
                      }}
                      placeholder="Add Comment (optional)"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      py="1rem"
                      h="120px"
                    />
                  </FormContainer>
                )}
              />

              <Flex>
                <Text color="white" fontSize="2.5rem">
                  My Friends
                </Text>
              </Flex>
              <RadioGroup onChange={setRadioValue} value={radioValue}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange } }): ReactElement => (
                    <FormControl>
                      {data?.length ? (
                        <>
                          {!loading ? (
                            data.map((item, index) => {
                              return (
                                <Box key={index}>
                                  <Flex justifyContent="space-between">
                                    <Box mt="1rem">
                                      <Flex justifyContent="flex-start">
                                        <Avatar name={item.name} />
                                        <Box w={200} textAlign="start" ml="1rem">
                                          <Text>{item.name}</Text>
                                          <Text>Username: {item.username ?? 'N/A'}</Text>
                                        </Box>
                                      </Flex>
                                    </Box>
                                    <Radio
                                      value={`${index + 1}`}
                                      colorScheme="teal"
                                      onChange={(): void => {
                                        onChange(item?.email);
                                        setSetToDetail(item);
                                      }}
                                    />
                                  </Flex>
                                  <Divider mt="1rem" />
                                </Box>
                              );
                            })
                          ) : (
                            <Spinner />
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </FormControl>
                  )}
                />

                <Flex my="1.5rem" justifyContent="space-between">
                  <Flex>
                    <Box ml="1rem">
                      <Image src={AddFriendIcon} alt="Add Bank Icon" />
                    </Box>

                    <Text ml="0.5rem" color="white" fontSize="1.25rem">
                      Add New Friend
                    </Text>
                  </Flex>

                  <Radio value={`${data?.length + 1}`} colorScheme="teal" />
                </Flex>
              </RadioGroup>

              {radioValue !== `${data?.length + 1}` ? (
                <></>
              ) : (
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: 'Email is required' }}
                  render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                    <FormContainer errorMessage={error?.message ?? ''}>
                      <TextField
                        type="email"
                        value={value ?? ''}
                        placeholder="Enter Email"
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormContainer>
                  )}
                />
              )}

              <Divider mt="2rem" />

              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                mt={{ base: '1rem', md: '2rem' }}
                w={350}
                h="3.25rem"
                isLoading={isPending || validating || updateMainFileLoading}
              >
                {radioValue !== `${data?.length + 1}` ? 'Send Tokens' : 'Add New Friend'}
              </Button>
            </form>
          </FormProvider>
        </Box>
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir="column" color="white">
          <Box mt="14rem">
            <Image src={SendQuxCash} width={100} height={100} alt="Redeem" placeholder="empty" />
          </Box>
          <Text color="white" fontSize="2rem">
            $ {amount.toFixed(2)}
          </Text>
          <Text my="12px">Tokens sent to</Text>
          <Flex justifyContent="flex-start">
            <Avatar name={sentToDetail.name} />
            <Box textAlign="start" ml="1rem">
              <Text>{sentToDetail.name}</Text>
              <Text>Username: {sentToDetail.username || 'N/A'}</Text>
            </Box>
          </Flex>
          <Button
            variant="primary"
            borderRadius="1rem"
            mt="16rem"
            w={350}
            h="3.25rem"
            onClick={(): void => void router.push('/dashboard')}
          >
            Back Home
          </Button>
        </Flex>
      )}
    </Box>
  );
};
