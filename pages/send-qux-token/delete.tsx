/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Button, Divider, Flex, Radio, RadioGroup, Spinner, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HeaderContainer } from 'component';
import { FETCH_FRIEND_LIST } from 'constants/api';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { getServerSideProps, notify } from 'utils';

const DeleteFriend: FC = () => {
  const router = useRouter();

  const { data, isLoading: loading } = useQuery({ queryKey: ['friendList'], queryFn: FETCH_FRIEND_LIST });
  const [radioValue, setRadioValue] = useState('');
  const [friendId, setFriendId] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/friends/remove`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify(`Successfully Delete`);
      void router.push('/send-qux-token');
    },
    onError: () => {
      notify(`ERROR`, { status: 'error' });
    },
  });

  return (
    <Box minH="100vh" mb="2rem">
      <HeaderContainer label="Send QUX ®Tokens" route="/dashboard">
        <Box px="1rem">
          <Box minH={600}>
            <Text color="white" fontSize="2rem" mt="2rem">
              My Friend
            </Text>

            <RadioGroup onChange={setRadioValue} value={radioValue}>
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
                              setFriendId(item?.friend_id);
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
              isLoading={isPending}
              onClick={(): void =>
                mutate({
                  friend_id: friendId,
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
              onClick={(): void => void router.push('/send-qux-token')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </HeaderContainer>
    </Box>
  );
};

export { getServerSideProps };

export default DeleteFriend;
