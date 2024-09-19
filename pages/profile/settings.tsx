import { Box, Button, Flex, Switch, Text } from '@chakra-ui/react';
import { DeleteAccountModal, HeaderContainer } from 'component';
import Image from 'next/image';
import { BellNotificationIcon } from 'public/assets';
import { FC } from 'react';
import { useDeleteAccountModal } from 'store/useDeleteAccountModal';

const SettingsPage: FC = () => {
  const setVisible = useDeleteAccountModal((e) => e.setVisible);
  const mockData = [
    {
      icon: BellNotificationIcon,
      label: 'Push Notification',
      route: '',
    },
    {
      icon: BellNotificationIcon,
      label: 'Email Notification',
      route: '',
    },
  ];
  return (
    <HeaderContainer label="Settings" route={'/profile'}>
      <Flex flexDir="column" justifyContent="space-between" h="85vh" mx="1rem" mt="2rem">
        <Box bg="blue.100" py="0.5rem" px="1.5rem" borderRadius="xl">
          {mockData.map((item) => (
            <Flex justifyContent="space-between" alignItems="center" my="1.5rem" key={item.label} cursor="pointer">
              <Flex alignItems="center" gap={4}>
                <Image src={item.icon} height={30} width={30} alt={item.label} />
                <Text fontWeight="semibold" color="white">
                  {item.label}
                </Text>
              </Flex>
              <Switch id={item.label} color="blue.100" />
            </Flex>
          ))}
        </Box>

        <Button variant="delete" onClick={(): void => setVisible(true)}>
          Delete Account
        </Button>

        <DeleteAccountModal />
      </Flex>
    </HeaderContainer>
  );
};

export default SettingsPage;
