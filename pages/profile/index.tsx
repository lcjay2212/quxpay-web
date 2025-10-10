import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Container, Divider, Flex, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { DeleteAccountModal } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useLogout, useUser } from 'store';
import { useDeleteAccountModal } from 'store/useDeleteAccountModal';

const ProfilePage: FC = () => {
  const { user } = useUser();
  const mockData = [
    // {
    //   icon: LinkAccountIcon,
    //   label: 'Link Account',
    //   route: '',
    // },
    {
      icon: '/assets/icons/credit-card-icon.webp',
      label: 'Manage Payments',
      route: '/manage-payments',
      isExternal: false,
      description: 'Add or edit payment methods',
    },
    {
      icon: '/assets/icons/help-icon.webp',
      label: 'Help',
      route: 'https://blog.quxpay.com/',
      isExternal: true,
      description: 'Get support and resources',
    },
    // {
    //   icon: SettingsIcon,
    //   label: 'Settings',
    //   route: '/profile/settings',
    // },
  ];
  const router = useRouter();
  const setVisible = useDeleteAccountModal((e) => e.setVisible);

  const { logout } = useLogout();

  // Responsive values
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const logoSize = useBreakpointValue({ base: 40, md: 50 });
  const titleFontSize = useBreakpointValue({ base: '2xl', md: '3xl' });
  const iconSize = useBreakpointValue({ base: 32, md: 40 });

  // Get user initials for avatar
  const userInitials =
    user?.firstname && user.lastname ? `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase() : 'U';

  return (
    <Container maxW="container.md" color="white" px={containerPadding} py={{ base: 4, md: 6 }} minH="100vh">
      <Flex flexDir="column" justifyContent="space-between" minH="90vh">
        <Box>
          {/* Header */}
          <Flex justifyContent="start" py={{ base: 3, md: 4 }} alignItems="center" mb={4}>
            <ArrowBackIcon
              color="white"
              mr={{ base: 3, md: 4 }}
              cursor="pointer"
              boxSize={{ base: 5, md: 6 }}
              onClick={(): void => {
                void router.push('/dashboard');
              }}
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.1)', color: 'primary' }}
            />
            <Box display="flex" justifyContent="center" height={`${logoSize}px`} mr={2}>
              <Image
                src="/assets/images/qux-pay-logo.webp"
                height={logoSize}
                width={logoSize}
                alt="Qux Logo"
                placeholder="empty"
              />
            </Box>

            <Text color="primary" fontSize={titleFontSize} fontWeight="bold">
              W<span style={{ color: 'white' }}>allet</span>
            </Text>
          </Flex>

          {/* User Profile Section */}
          <VStack spacing={3} mb={6}>
            <Avatar
              size={{ base: 'xl', md: '2xl' }}
              name={`${user?.firstname} ${user?.lastname}`}
              bg="primary"
              color="white"
              fontWeight="bold"
              fontSize={{ base: '2xl', md: '3xl' }}
              border="4px solid"
              borderColor="whiteAlpha.300"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
            >
              {userInitials}
            </Avatar>
            <VStack spacing={1}>
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" textAlign="center">
                {user?.firstname} {user?.lastname}
              </Text>
              <Text fontSize={{ base: 'sm', md: 'md' }} color="whiteAlpha.700" textAlign="center">
                {user?.email || 'Welcome back!'}
              </Text>
            </VStack>
          </VStack>

          <Divider borderColor="whiteAlpha.300" my={{ base: 4, md: 6 }} />

          {/* Menu Items */}
          <Box
            bg="whiteAlpha.100"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          >
            {mockData.map((item, index) => (
              <Box key={item.label}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  px={{ base: 4, md: 6 }}
                  py={{ base: 4, md: 5 }}
                  cursor="pointer"
                  transition="all 0.3s ease"
                  position="relative"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    transform: 'translateX(4px)',
                    '& .menu-icon': {
                      transform: 'scale(1.1)',
                    },
                    '& .chevron-icon': {
                      transform: 'translateX(4px)',
                      color: 'primary',
                    },
                  }}
                  _active={{
                    bg: 'whiteAlpha.300',
                    transform: 'scale(0.98)',
                  }}
                  onClick={(): void => {
                    if (item.isExternal) {
                      void window.open(item.route, 'noopener,noreferrer');
                    } else {
                      void router.push(item.route);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e): void => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (item.isExternal) {
                        void window.open(item.route, 'noopener,noreferrer');
                      } else {
                        void router.push(item.route);
                      }
                    }
                  }}
                >
                  <Flex alignItems="center" gap={{ base: 3, md: 4 }} flex={1}>
                    <Box
                      className="menu-icon"
                      transition="transform 0.3s ease"
                      bg="whiteAlpha.200"
                      p={2}
                      borderRadius="lg"
                    >
                      <Image src={item.icon} height={iconSize} width={iconSize} alt={item.label} />
                    </Box>
                    <VStack align="start" spacing={0.5}>
                      <Text fontWeight="semibold" fontSize={{ base: 'md', md: 'lg' }} color="white">
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="whiteAlpha.600">
                          {item.description}
                        </Text>
                      )}
                    </VStack>
                  </Flex>
                  <ChevronRightIcon
                    className="chevron-icon"
                    w={{ base: 6, md: 8 }}
                    h={{ base: 6, md: 8 }}
                    color="whiteAlpha.600"
                    transition="all 0.3s ease"
                  />
                </Flex>
                {index < mockData.length - 1 && <Divider borderColor="whiteAlpha.200" />}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <VStack spacing={3} mt={8} pb={{ base: 4, md: 6 }}>
          <Button
            variant="secondary"
            w="full"
            size={{ base: 'md', md: 'lg' }}
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="semibold"
            borderRadius="xl"
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            onClick={(): void => void logout({ message: 'Logged out successfully.' })}
          >
            Logout
          </Button>

          <Button
            variant="delete"
            w="full"
            size={{ base: 'md', md: 'lg' }}
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="semibold"
            borderRadius="xl"
            transition="all 0.3s ease"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(255, 0, 0, 0.3)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            onClick={(): void => setVisible(true)}
          >
            Delete Account
          </Button>
        </VStack>
      </Flex>
      <DeleteAccountModal />
    </Container>
  );
};

export default ProfilePage;
