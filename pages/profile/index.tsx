import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Divider, Flex, Text } from '@chakra-ui/react';
import { DeleteAccountModal } from 'component';
import { isLocalHost } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo, SettingsIcon } from 'public/assets';
import { FC } from 'react';
import { useUser } from 'store';
import { useDeleteAccountModal } from 'store/useDeleteAccountModal';
import { useLogin } from 'store/useLogin';

const ProfilePage: FC = () => {
  const { user } = useUser();
  const mockData = [
    // {
    //   icon: LinkAccountIcon,
    //   label: 'Link Account',
    //   route: '',
    // },
    // {
    //   icon: HelpIcon,
    //   label: 'Help',
    //   route: '',
    // },
    {
      icon: SettingsIcon,
      label: 'Settings',
      route: '/profile/settings',
    },
  ];
  const router = useRouter();
  const setVisible = useDeleteAccountModal((e) => e.setVisible);

  const { logout } = useLogin();

  return (
    <Container color="white" overflow="hidden">
      <Flex flexDir="column" justifyContent="space-between" h="95vh">
        <Box>
          <Flex justifyContent="start" py="1rem" alignItems="center">
            <ArrowBackIcon
              color="white"
              mr="1rem"
              cursor="pointer"
              onClick={(): void => {
                void router.push('/dashboard');
              }}
            />
            <Box display="flex" justifyContent="center" height="50px" mr="8px">
              <Image src={QuxPayLogo} height={50} width={50} alt="Qux Logo" placeholder="empty" />
            </Box>

            <Text color="primary" fontSize="3xl" textAlign="center">
              W<span style={{ color: 'white' }}>allet</span>{' '}
            </Text>
          </Flex>

          <Text textAlign="center" my="2rem" fontWeight="bold">
            {user?.firstname} {user?.lastname}
          </Text>

          <Box bg="primary" py="1rem" px="1rem" borderRadius="xl">
            <Text fontSize="12px">My Referral Code</Text>
            <Text fontWeight="bold">test123-test123</Text>
          </Box>

          <Divider my="1.5rem" />

          {isLocalHost() && (
            <Box bg="blue.100" py="0.5rem" px="1.5rem" borderRadius="xl">
              {mockData.map((item) => (
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  my="1.5rem"
                  key={item.label}
                  cursor="pointer"
                  onClick={(): void => {
                    void router.push(item.route);
                  }}
                >
                  <Flex alignItems="center" gap={4}>
                    <Image src={item.icon} height={35} width={35} alt={item.label} />
                    <Text fontWeight="semibold">{item.label}</Text>
                  </Flex>
                  <ChevronRightIcon w={8} h={8} />
                </Flex>
              ))}
            </Box>
          )}
        </Box>

        <Flex flexDir="column" gap={3}>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>

          {isLocalHost() && (
            <Button variant="delete" onClick={(): void => setVisible(true)}>
              Delete Account
            </Button>
          )}
        </Flex>
      </Flex>
      <DeleteAccountModal />
    </Container>
  );
};

export default ProfilePage;
