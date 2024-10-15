/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
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
import { useQuery } from '@tanstack/react-query';
import {
  AmountVerificationModal,
  CryptoTransactionHistory,
  NotificationHistory,
  OpenPosHistory,
  PendingBankAccountVerificationModal,
  PoFromPluginHistory,
  TokenHistory,
  TransactionHistory,
  UploadLoadingModal,
  VerifyModal,
} from 'component';
import { FETCH_BANK_STATUS, FETCH_POS_HISTORY } from 'constants/api';
import { API_SESSION_URL } from 'constants/url';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogo, QuxTokenIcon } from 'public/assets';
import { FC, useEffect } from 'react';
import { usePendingBankAccountVerificationModal, useUser, useVerifyModal } from 'store';
import { useDecryptedData } from 'store/useDecryptedData';
import { clearStorage, getServerSideProps, notify, queryClient } from 'utils';

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
  const [user, setUser] = useUser((e) => [e.user, e.setUser]);

  const { data: balance, dataLoading } = useDecryptedData('balance');

  const setVisible = usePendingBankAccountVerificationModal(({ setVisible }) => setVisible);

  const { isLoading } = useQuery<{ unpaid_or_open: PosHistoryProps[] }>({
    queryKey: ['posHistory'],
    queryFn: FETCH_POS_HISTORY,
  });

  const { data } = useQuery({
    queryKey: ['bankStatus'],
    queryFn: FETCH_BANK_STATUS,
  });

  const router = useRouter();

  const setVerifyModalVisible = useVerifyModal((e) => e.setVisible);
  const logout = async (): Promise<void> => {
    const loginSession = await fetch(`${API_SESSION_URL}/api/logout`);
    const json = await loginSession.json();

    if (json.success) {
      clearStorage();
      notify('Successfully Logout');
      setUser(null);
      void router.push('/');
      queryClient.clear();
    } else {
      // TODO: handler
    }
  };

  useEffect(() => {
    if (balance?.balance?.verification_status !== 'for_review' && Number(balance?.balance?.total_purchase) >= 600) {
      setVerifyModalVisible(true);
    }
  }, [setVerifyModalVisible, balance]);

  const DashboarMenuComponent = dynamic(() => import('../component/DashboardMenu'), {
    ssr: false,
  });

  return (
    <Container color="white" mb="3rem" overflow="hidden" fontFamily="'Poppins', sans-serif">
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

      <Box>
        <Grid templateColumns="repeat(3, 1fr)" gap={1} bg="primary" p="1rem" borderRadius="xl" my="1rem">
          <Label
            label="Available Balance"
            image={QuxTokenIcon}
            amount={(balance?.balance?.balance || 0).toFixed(2)}
            loading={dataLoading}
          />
          <Flex justifyContent="center">
            <Divider colorScheme="red" orientation="vertical" variant="dashed" />
          </Flex>
          <Label
            label="Purchase Pending"
            image={QuxTokenIcon}
            amount={Number(balance?.balance?.deposit || 0).toFixed(2)}
            loading={dataLoading}
          />
          <Label label="Tagged Tokens" image={QuxTokenIcon} amount={(0).toFixed(2)} loading={dataLoading} />
          <Flex justifyContent="center">
            <Divider colorScheme="red" orientation="vertical" variant="dashed" />
          </Flex>
          <Label
            label="Redeem Pending"
            image={QuxTokenIcon}
            amount={Number(balance?.balance?.withdraw_pending || 0).toFixed(2)}
            loading={dataLoading}
          />
        </Grid>

        {data?.status === 'Pending' && (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb="1rem"
            mx="1rem"
            onClick={(): void => setVisible(true)}
          >
            <Text color="red.500" cursor="pointer">
              Verify Account: Bank Nickname
            </Text>
            <ArrowForwardIcon cursor="pointer" color="red.500" />
          </Flex>
        )}

        <DashboarMenuComponent />
        <NotificationHistory />
        <TransactionHistory />
        <OpenPosHistory loading={isLoading} />
        <TokenHistory loading={isLoading} />
        {user?.corporate && <PoFromPluginHistory loading={isLoading} />}
        <CryptoTransactionHistory />
        <UploadLoadingModal />
        <PendingBankAccountVerificationModal />
        <AmountVerificationModal />
        <VerifyModal />
      </Box>
    </Container>
  );
};

export { getServerSideProps };

export default Dashboard;
