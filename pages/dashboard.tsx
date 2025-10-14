/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Container,
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
  // CryptoTransactionHistory,
  NotificationHistory,
  OpenPosHistory,
  PendingBankAccountVerificationModal,
  PoFromPluginHistory,
  SEO,
  TokenHistory,
  TransactionHistory,
  TransactionHistoryModal,
  UnableToVerifyModal,
  UploadLoadingModal,
  VerifyModal,
} from 'component';
import { FETCH_POS_HISTORY, FETCH_USER_DETAILS } from 'constants/api';
import storage from 'constants/storage';
import { useBankStatus } from 'hooks';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useAmountVerificationModal, useLogout, usePendingBankAccountVerificationModal, useUser } from 'store';
import { useDecryptedData } from 'store/useDecryptedData';
import { getServerSideProps } from 'utils';

const Label: FC<{ label: string; image: any; amount: any; loading: boolean }> = ({ label, image, amount, loading }) => (
  <Box
    w="full"
    p={{ base: 3, md: 4 }}
    bg="primary"
    borderRadius="lg"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255, 255, 255, 0.2)"
    _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
    transition="all 0.3s ease"
  >
    <Text fontWeight="bold" fontSize={{ base: '12px', sm: '14px', md: '16px' }} color="white" mb={2} textAlign="center">
      {label}
    </Text>
    <Flex alignItems="center" justifyContent="center" gap={2}>
      <Image src={image} width={24} height={16} alt="Qux eToken®" />
      {!loading ? (
        <Text
          fontSize={{ base: '18px', sm: '20px', md: '24px' }}
          fontWeight="semibold"
          color="white"
          textAlign="center"
        >
          {amount}
        </Text>
      ) : (
        <Spinner size="sm" color="white" />
      )}
    </Flex>
  </Box>
);

const Dashboard: FC = () => {
  const user = useUser((e) => e.user);
  const router = useRouter();

  const { data: balance, dataLoading } = useDecryptedData('balance');

  const setVisible = useAmountVerificationModal(({ setVisible }) => setVisible);
  const { setIsPendingBankAccountVerificationModal } = usePendingBankAccountVerificationModal((e) => ({
    setIsPendingBankAccountVerificationModal: e.setVisible,
  }));

  const { isLoading } = useQuery<{ unpaid_or_open: PosHistoryProps[] }>({
    queryKey: ['posHistory'],
    queryFn: FETCH_POS_HISTORY,
  });

  const { data: userDetails } = useQuery({
    queryKey: ['userDetails'],
    queryFn: FETCH_USER_DETAILS,
  });

  useEffect(() => {
    const sessionData = localStorage.getItem(storage.QUX_PAY_USER_DETAILS);
    if (userDetails?.has_store) {
      const parsedSessionData = JSON.parse(sessionData || '{}');
      parsedSessionData.has_store = userDetails.has_store;
      localStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(parsedSessionData));
    }
  }, [userDetails]);

  const { data } = useBankStatus();

  const { logout } = useLogout();

  const DashboarMenuComponent = dynamic(() => import('../component/DashboardMenu'), {
    ssr: false,
  });

  useEffect(() => {
    if (data?.status === 'Pending') {
      setIsPendingBankAccountVerificationModal(true);
    }
  }, [data, setIsPendingBankAccountVerificationModal]);

  return (
    <Box minH="100vh">
      <SEO page="dashboard" />
      <Container
        maxW="container.xl"
        color="white"
        py={{ base: 4, md: 6 }}
        px={{ base: 4, md: 6 }}
        fontFamily="'Poppins', sans-serif"
      >
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={{ base: 6, md: 8 }} flexWrap="wrap" gap={4}>
          <Flex alignItems="center" gap={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="80px"
              h="80px"
              borderRadius="xl"
              p={3}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
              }}
              cursor="pointer"
              onClick={(): void => void router.push('/')}
            >
              <Image
                src="/assets/images/qux-pay-logo.webp"
                height={50}
                width={50}
                alt="Qux Pay Logo"
                placeholder="empty"
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Text color="white" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" textAlign="center">
              W<chakra.span color="primary">allet</chakra.span>
            </Text>
          </Flex>

          <Box>
            <Menu>
              <MenuButton
                bg="rgba(255, 255, 255, 0.1)"
                _active={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
                as={IconButton}
                icon={<HamburgerIcon />}
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="lg"
              />
              <MenuList bg="white" borderRadius="lg" boxShadow="xl">
                <MenuItem
                  onClick={(): void => void router.push('/manage-payments')}
                  color="black"
                  _hover={{ bg: 'gray.50' }}
                >
                  Manage Payments
                </MenuItem>
                <MenuItem
                  onClick={(): void => void logout({ message: 'Logged out successfully.' })}
                  color="red.500"
                  _hover={{ bg: 'red.50' }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>

        {/* Balance Cards */}
        <Box mb={8}>
          <Grid templateColumns="repeat(2, 1fr)" gap={{ base: 4, md: 6 }} mb={6}>
            <Label
              label="Available Balance"
              image="/assets/icons/qux-token.webp"
              amount={(balance?.balance?.balance || 0).toFixed(2)}
              loading={dataLoading}
            />
            <Label
              label="Purchase Pending"
              image="/assets/icons/qux-token.webp"
              amount={Number(balance?.balance?.deposit || 0).toFixed(2)}
              loading={dataLoading}
            />
            <Label
              label="Tagged Tokens"
              image="/assets/icons/qux-token.webp"
              amount={(0).toFixed(2)}
              loading={dataLoading}
            />
            <Label
              label="Redeem Pending"
              image="/assets/icons/qux-token.webp"
              amount={Number(balance?.balance?.withdraw_pending || 0).toFixed(2)}
              loading={dataLoading}
            />
          </Grid>

          {/* Verification Alert */}
          {data?.status === 'Pending' && (
            <Box
              bg="rgba(239, 68, 68, 0.1)"
              border="1px solid rgba(239, 68, 68, 0.3)"
              borderRadius="lg"
              p={4}
              mb={6}
              cursor="pointer"
              onClick={(): void => setVisible(true)}
              _hover={{
                bg: 'rgba(239, 68, 68, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
              }}
              transition="all 0.3s ease"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text color="red.300" fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                  Verify Account: {data.account_nickname}
                </Text>
                <ArrowForwardIcon color="red.300" />
              </Flex>
            </Box>
          )}
        </Box>

        {/* Dashboard Content */}
        <DashboarMenuComponent />
        <NotificationHistory />

        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
          }}
          gap={{ base: 4, md: 6 }}
        >
          <TransactionHistory />
          <OpenPosHistory loading={isLoading} />
          <TokenHistory loading={isLoading} />
          {user?.corporate && <PoFromPluginHistory loading={isLoading} />}
          {/* <CryptoTransactionHistory /> */}
        </Grid>

        <UploadLoadingModal />
        <PendingBankAccountVerificationModal />
        <AmountVerificationModal />
        <VerifyModal />
        <UnableToVerifyModal />
        <TransactionHistoryModal />
      </Container>
    </Box>
  );
};

export { getServerSideProps };

export default Dashboard;
