import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Divider, Flex, Text } from '@chakra-ui/react';
import { API_SESSION_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo } from 'public/assets';
import { FC } from 'react';
import { useUser } from 'store/useUser';
import { clearStorage } from 'utils/clearStorage';
import { notify } from 'utils/notify';

const ProfilePage: FC = () => {
  const { user } = useUser();
  const mockData = [
    {
      icon: '',
      label: 'Link Account',
      route: '',
    },
    {
      icon: '',
      label: 'Help',
      route: '',
    },
  ];
  const router = useRouter();

  const logout = async (): Promise<void> => {
    const loginSession = await fetch(`${API_SESSION_URL}/api/logout`);
    const json = await loginSession.json();

    if (json.success) {
      clearStorage();
      notify('Successfully Logout');
      void router.push('/');
    } else {
      // TODO: handler
    }
  };

  return (
    <Container color="white" overflow="hidden">
      <Flex flexDir="column" justifyContent="space-between" h="95vh">
        <Box>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex justifyContent="start" py="1rem">
              <Box display="flex" justifyContent="center" height="50px" mr="8px">
                <Image src={QuxPayLogo} height={50} width={50} alt="Qux Logo" placeholder="empty" />
              </Box>

              <Text color="primary" fontSize="3xl" textAlign="center">
                W<span style={{ color: 'white' }}>allet</span>{' '}
              </Text>
            </Flex>
          </Flex>

          <Text textAlign="center" my="2rem" fontWeight="bold">
            {user?.firstname} {user?.lastname}
          </Text>

          <Box bg="primary" py="1rem" px="1rem" borderRadius="xl">
            <Text fontSize="12px">My Referral Code</Text>
            <Text fontWeight="bold">test123-test123</Text>
          </Box>

          <Divider my="1.5rem" />

          <Box bg="blue.100" py="0.5rem" px="1.5rem" borderRadius="xl">
            {mockData.map((item) => (
              <Flex justifyContent="space-between" alignItems="center" my="0.75rem" key={item.label}>
                <Flex>
                  <Text fontWeight="semibold">{item.label}</Text>
                </Flex>
                <ChevronRightIcon w={8} h={8} />
              </Flex>
            ))}
          </Box>
        </Box>

        <Flex flexDir="column" gap={3}>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>

          <Button variant="delete">Delete Account</Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ProfilePage;
