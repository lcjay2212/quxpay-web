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
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FETCH_FRIEND_LIST } from 'constants/api';
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
  const [friendId, setFriendId] = useState();
  const [comment, setComment] = useState('');

  const { data, isLoading: loading, refetch } = useQuery('friendList', FETCH_FRIEND_LIST, errorHandler);
  const [sentToDetail, setSetToDetail] = useState<{
    name: string;
    username: string;
    email: string;
  }>(data?.[0] || {});

  const { mutate: sendTokens, isLoading: sending } = useMutation(
    (variable) =>
      axios.post(
        `${STAGING_URL}/web/transfer?amount=${amount}&user_id=${friendId}&type=tag_token&comment=${comment}`,
        variable,
        {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
            Version: 2,
          },
        }
      ),
    {
      onSuccess: () => {
        setSuccessTrigger(true);
      },
      onError: ({ response }) => {
        notify(response?.data?.status?.message, { status: 'error' });
      },
    }
  );

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/friends/add`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        void refetch();
        setRadioValue('');
      },
      onError: ({ response }) => {
        notify(response?.data?.status?.message, { status: 'error' });
      },
    }
  );

  const onDeposit = (val): void => {
    if (radioValue !== `${data?.length + 1}`) {
      sendTokens();
    } else {
      mutate(val);
    }
  };

  return (
    <Box textAlign="center" overflow="hidden" px="1rem">
      {!successTrigger ? (
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onDeposit)}>
            <Controller
              control={control}
              name="amount"
              rules={{ required: radioValue !== `${data?.length + 1}` ? 'Amount is required' : false }}
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

            <Controller
              control={control}
              name="comment"
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
                    onChange={(e): void => {
                      onChange(e.target.value);
                      setComment(e.target.value);
                    }}
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
                name="id"
                render={({ field: { onChange } }): ReactElement => (
                  <FormControl>
                    {data?.length ? (
                      <>
                        {!loading ? (
                          data.map((item, index) => {
                            return (
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
                                      onChange(item?.id);
                                      setFriendId(item?.id);
                                      setSetToDetail(item);
                                    }}
                                  />
                                </Flex>
                                <Divider mt="1rem" />
                              </>
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
              isLoading={isLoading || sending}
            >
              {radioValue !== `${data?.length + 1}` ? 'Send Tokens' : 'Add New Friend'}
            </Button>
          </form>
        </FormProvider>
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
export default SendQuxTokenWrapper;
