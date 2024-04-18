/* eslint-disable @typescript-eslint/no-explicit-any */
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Container,
  Divider,
  Flex,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import UploadLoadingModal from 'component/Modal/UploadLoadingModal';
import NotificationHistory from 'component/NotificationHistory/NotificationHistory';
import OpenPosHistory from 'component/OpenPosHistory/OpenPosHistory';
import TokenHistory from 'component/TokenHistory/TokenHistory';
import TransactionHistory from 'component/TransactionHistory/TransactionHistory';
import { API_SESSION_URL, STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  BillsIcon,
  CashIn,
  InsightIcon,
  ProfileIcon,
  QuxPayLogo,
  QuxTokenIcon,
  SendQuxCash,
  UploadIcon,
  WithdrawSuccessful,
} from 'public/assets';
import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useBalance } from 'store/useBalance';
import usePosHistory from 'store/usePosHistory';
import { usePrivatekey } from 'store/usePrivatekey';
import { useUploadLoadingModal } from 'store/useUploadLoadingModal';
import { useUser } from 'store/useUser';
import { clearStorage } from 'utils/clearStorage';
import { getServerSideProps } from 'utils/getServerSideProps';
import { notify } from 'utils/notify';

const Label: FC<{ label: string; image: any; amount: any; loading: boolean }> = ({ label, image, amount, loading }) => (
  <Box w={{ base: 150, md: 250 }}>
    <Text fontWeight="bold" fontSize={{ base: '14px', md: '1rem' }}>
      {label}
    </Text>
    <Flex alignItems="center">
      <span>
        <Image src={image} width={30} height={20} alt="Qux Token" />
      </span>
      {!loading ? (
        <Text fontSize="24px" fontWeight="semibold">
          {amount}
        </Text>
      ) : (
        <Spinner />
      )}
    </Flex>
  </Box>
);

const Dashboard: FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const setVisible = useUploadLoadingModal((set) => set.setVisible);
  const setPrivatekey = usePrivatekey((state) => state.setPrivatekey);

  useEffect(() => {
    const url = user?.privatekey;

    const config = {
      mode: 'get',
      url,
    };

    axios
      .request(config)
      .then((response) => setPrivatekey(response.data))
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [setPrivatekey, user]);

  const temp = [
    {
      image: CashIn,
      alt: 'Purchase',
      route: '/purchase',
      label: 'Purchase',
      show: true,
    },
    {
      image: WithdrawSuccessful,
      alt: 'Redeem',
      route: '/redeem',
      label: 'Redeem Tokens',
      show: true,
    },
    {
      image: SendQuxCash,
      alt: 'Send',
      route: '/send-qux-token',
      label: 'Send Qux® Token',
      show: true,
    },
    {
      image: BillsIcon,
      alt: 'Pay Bills',
      route: '/pay-bills',
      label: 'Pay Bills',
      show: true,
    },
    {
      image: UploadIcon,
      alt: 'Upload',
      route: '/',
      label: 'Upload CSV File',
      show: user?.corporate,
    },
    {
      image: SendQuxCash,
      alt: 'Create',
      route: '/create-po',
      label: 'Create PO',
      show: user?.corporate,
    },
    {
      image: InsightIcon,
      alt: 'Insights',
      route: '/insights',
      label: 'Insights',
      show: true,
    },
    {
      image: ProfileIcon,
      alt: 'Profile',
      route: '/profile',
      label: 'Profile',
      show: true,
    },
  ];

  const { isLoading, balance, deposit, withdrawalPending } = useBalance();
  const { refetch } = usePosHistory();
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

  const { mutate, isLoading: uploadLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/corporate/upload/transactions`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
        },
      }),
    {
      onSuccess: () => {
        notify('Upload success!');
        setVisible(false);
        refetch();
      },
      onError: ({ response }) => {
        notify(`${response.data?.data.format}`, { status: 'error' });
        setVisible(false);
      },
    }
  );

  useEffect(() => {
    if (uploadLoading) {
      setVisible(true);
    }
  }, [uploadLoading, setVisible]);

  return (
    <Container color="white" mb="3rem" overflow="hidden">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex justifyContent="start" py="1rem">
          <Box display="flex" justifyContent="center" height="50px" mr="8px">
            <Image src={QuxPayLogo} height={50} width={50} alt="Qux Logo" placeholder="empty" />
          </Box>

          <Text color="primary" fontSize="3xl" textAlign="center">
            W<span style={{ color: 'white' }}>allet</span>{' '}
          </Text>
        </Flex>
        <Box>
          <Menu>
            <MenuButton bg="color.dark" _active={{ bg: 'color.dark' }} as={IconButton} icon={<HamburgerIcon />} />
            <MenuList>
              <MenuItem onClick={logout} color="black">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={1} bg="primary" p="1rem" borderRadius="xl" my="1rem">
        <Label label="Available Balance" image={QuxTokenIcon} amount={balance.toFixed(2)} loading={isLoading} />
        <Flex justifyContent="center">
          <Divider colorScheme="red" orientation="vertical" variant="dashed" />
        </Flex>
        <Label label="Purchase Pending" image={QuxTokenIcon} amount={deposit.toFixed(2)} loading={isLoading} />
        <Label label="Tagged Tokens" image={QuxTokenIcon} amount={0} loading={isLoading} />
        <Flex justifyContent="center">
          <Divider colorScheme="red" orientation="vertical" variant="dashed" />
        </Flex>
        <Label label="Redeem Pending" image={QuxTokenIcon} amount={withdrawalPending.toFixed(2)} loading={isLoading} />
      </Grid>
      <Grid
        templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={{ base: 2, md: 6 }}
        bg="blue.100"
        py="1rem"
        px="1.5rem"
        borderRadius="xl"
      >
        {temp.map((item) => (
          <Box key={item.alt}>
            {item.show && (
              <Box key={item.label}>
                <chakra.input
                  type="file"
                  id="Upload"
                  display="none"
                  onChange={(e: any): void => {
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    mutate(formData as any);
                  }}
                />
                <chakra.label
                  htmlFor={item.alt}
                  key={item.alt}
                  w={100}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{
                    color: 'primary',
                  }}
                  id={item.alt}
                  onClick={(): void => {
                    if (item.alt !== 'Upload') {
                      void router.push(item.route);
                    }
                  }}
                >
                  <Flex justifyContent="center" width="auto" height={50}>
                    <Image
                      src={item.image}
                      width={item.alt === 'Upload' ? 45 : 55}
                      height={50}
                      alt={item.alt}
                      placeholder="empty"
                    />
                  </Flex>
                  <Text mt="0.5rem" fontSize={{ base: '0.75rem', md: '1rem' }}>
                    {item.label}
                  </Text>
                </chakra.label>
              </Box>
            )}
          </Box>
        ))}
      </Grid>

      <NotificationHistory />
      <TransactionHistory />
      <OpenPosHistory />
      <TokenHistory />

      <UploadLoadingModal />
    </Container>
  );
};

export { getServerSideProps };

export default Dashboard;
