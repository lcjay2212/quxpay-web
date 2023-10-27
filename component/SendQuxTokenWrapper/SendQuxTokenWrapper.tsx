import { Avatar, Box, Button, Divider, Flex, FormControl, Radio, RadioGroup, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_FRIEND_LIST, options } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddFriendIcon, SendQuxCash } from 'public/assets';
import { FC, ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';

const SendQuxTokenWrapper: FC = () => {
  const router = useRouter();
  const method = useForm();

  const { control, handleSubmit } = method;
  const [radioValue, setRadioValue] = useState('');
  const [successTrigger, setSuccessTrigger] = useState(false);
  const [amount, setAmount] = useState(0);

  const { data, isLoading: loading } = useQuery('friendList', FETCH_FRIEND_LIST, errorHandler);
  const [sentToDetail, setSetToDetail] = useState<{
    name: string;
    username: string;
    email: string;
  }>(data?.[0] || {});

  const { mutate, isLoading } = useMutation(
    (variable) => axios.post(`${STAGING_URL}/web/wallet/transfer-fund`, variable, options),
    {
      onSuccess: () => {
        setSuccessTrigger(true);
      },
      onError: () => {
        notify(`Failed to sent`, { status: 'error' });
      },
    }
  );

  const { mutate: addFriend } = useMutation((variable) =>
    axios.post(`${STAGING_URL}/web/friends/add`, variable, options)
  );

  const onDeposit = (val): void => {
    mutate(val);
    if (radioValue === `${data?.length + 1}`) addFriend(val);
  };

  return (
    <Box textAlign="center" overflow="hidden">
      {!successTrigger ? (
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onDeposit)}>
            <Controller
              control={control}
              name="amount"
              rules={{ required: 'Amount is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer label="Minimum Amount $20" errorMessage={error?.message ?? ''} place="end">
                  <TextField
                    type="number"
                    value={value ?? ''}
                    placeholder="Enter Amount"
                    onChange={(e): void => {
                      onChange(+e.target.value);
                      setAmount(+e.target.value);
                    }}
                    onBlur={onBlur}
                    min={20}
                  />
                </FormContainer>
              )}
            />

            <RadioGroup onChange={setRadioValue} value={radioValue}>
              <Controller
                control={control}
                name="email"
                rules={{ required: radioValue === '1' ? 'Email is required' : false }}
                render={({ field: { onChange } }): ReactElement => (
                  <FormControl>
                    {data?.length ? (
                      <>
                        {!loading ? (
                          data.map((item, index) => (
                            <>
                              <Flex justifyContent="space-between" key={index}>
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
                            </>
                          ))
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
              isLoading={isLoading}
            >
              Send Token
            </Button>
          </form>
        </FormProvider>
      ) : (
        <Flex justifyContent="center" alignItems="center" flexDir="column">
          <Box mt="14rem">
            <Image src={SendQuxCash} width={100} height={100} alt="Withdrawal" />
          </Box>
          <Text color="white" fontSize="2rem">
            ${amount.toFixed(2)}
          </Text>
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
export default SendQuxTokenWrapper;
