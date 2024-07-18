/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Button, Divider, Flex, Radio, RadioGroup, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { HeaderContainer } from 'component/Header';
import { FETCH_FRIEND_LIST } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { getServerSideProps } from 'utils/getServerSideProps';
import { notify } from 'utils/notify';

const DeleteFriend: FC = () => {
  const router = useRouter();

  const { data, isLoading: loading } = useQuery('friendList', FETCH_FRIEND_LIST, errorHandler);
  const [radioValue, setRadioValue] = useState('');
  const [friendId, setFriendId] = useState('');

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/friends/remove`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: () => {
        notify(`Successfully Delete`);
        void router.push('/send-qux-token');
      },
      onError: () => {
        notify(`ERROR`, { status: 'error' });
      },
    }
  );

  return (
    <Box h="100vh" overflow="hidden">
      <HeaderContainer label="Send QUX ®Tokens" route="/dashboard">
        <Box px="1rem">
          <Box maxH={600}>
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
              isLoading={isLoading}
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
