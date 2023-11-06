import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import TransactionHistory from 'component/TransactionHistory/TransactionHistory';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CashIn, QuxPayLogo, QuxTokenIcon, SendQuxCash, WithdrawSuccessful } from 'public/assets';
import { FC } from 'react';
import { useBalance } from 'store/useBalance';
import { clearStorage } from 'utils/clearStorage';
import { notify } from 'utils/notify';

const Label: FC<{ label: string; image: any; amount: number; loading: boolean }> = ({
  label,
  image,
  amount,
  loading,
}) => (
  <Flex fontSize="2xl" alignItems="center">
    <Text w={200}>{label}</Text>&nbsp;
    <span>
      <Image src={image} width={30} height={20} alt="Qux Token" />
    </span>
    {!loading ? <> {amount}</> : <Spinner />}
  </Flex>
);

const Dashboard: FC = () => {
  const router = useRouter();
  const temp = [
    {
      image: CashIn,
      alt: 'Cash in',
      route: '/purchase',
      label: 'Purchase',
    },
    {
      image: WithdrawSuccessful,
      alt: 'Redeem',
      route: '/redeem',
      label: 'Redeem Tokens',
    },
    {
      image: SendQuxCash,
      alt: 'Send Qux',
      route: '/send-qux-token',
      label: 'Send Qux® Token',
    },
  ];

  const { isLoading, balance, deposit, withdrawalPending } = useBalance();

  return (
    <Container color="white" maxH="100vh">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex justifyContent="start" py="1rem">
          <Box display="flex" justifyContent="center" height="50px" mr="8px">
            <Image src={QuxPayLogo} height={50} width={50} alt="Qux Logo" />
          </Box>

          <Text color="primary" fontSize="3xl" textAlign="center">
            W<span style={{ color: 'white' }}>allet</span>{' '}
          </Text>
        </Flex>
        <Box>
          <Menu>
            <MenuButton bg="color.dark" _active={{ bg: 'color.dark' }} as={IconButton} icon={<HamburgerIcon />} />
            <MenuList>
              <MenuItem
                onClick={(): void => {
                  clearStorage();
                  notify('Successfully Logout');
                  void router.push('/');
                }}
                color="black"
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      <Flex justifyContent="space-between" mt="2rem">
        {temp.map((item) => (
          <Box
            key={item.alt}
            w={100}
            textAlign="center"
            cursor="pointer"
            _hover={{
              color: 'primary',
            }}
            onClick={(): void => void router.push(item.route)}
          >
            <Flex justifyContent="center" width="auto" height={50}>
              <Image src={item.image} width={55} height={50} alt={item.alt} />
            </Flex>
            <Text>{item.label}</Text>
          </Box>
        ))}
      </Flex>

      <Box>
        <Text fontSize="3xl" fontWeight="bold" mb="2rem" mt="1rem">
          My Balance
        </Text>

        <Label label="Available Balance" image={QuxTokenIcon} amount={balance} loading={isLoading} />
        <Label label="Purchase Pending" image={QuxTokenIcon} amount={deposit} loading={isLoading} />
        <Label label="Redeem Pending" image={QuxTokenIcon} amount={withdrawalPending} loading={isLoading} />
      </Box>

      <TransactionHistory />
    </Container>
  );
};

export default Dashboard;
