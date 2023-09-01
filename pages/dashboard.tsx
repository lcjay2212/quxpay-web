import { Box, chakra, Container, Flex, Text } from '@chakra-ui/react';
import TransactionHistory from 'component/TransactionHistory/TransactionHistory';
import { FETCH_WALLET_BALANCE } from 'constants/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CashIn, QuxPayLogo, QuxTokenIcon, SendQuxCash, WithdrawSuccessful } from 'public/assets';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const Label: FC<{ label: string; image: any; amount: number }> = ({ label, image, amount }) => (
  <Flex fontSize="2xl" alignItems="center">
    <Text w={200}>{label}</Text>&nbsp;
    <span>
      <Image src={image} width={30} height={20} alt="Qux Token" />
    </span>
    {amount}
  </Flex>
);

const Dashboard: FC = () => {
  const router = useRouter();
  const temp = [
    {
      image: CashIn,
      alt: 'Cash in',
      route: '/deposit',
      label: 'Deposit',
    },
    {
      image: WithdrawSuccessful,
      alt: 'Withdrawal',
      route: '/withdrawal',
      label: 'Deposit',
    },
    {
      image: SendQuxCash,
      alt: 'Send Qux',
      route: '/send-qux-token',
      label: 'Send Qux® Token',
    },
  ];

  const { data } = useQuery('balance', FETCH_WALLET_BALANCE, errorHandler);

  return (
    <Container color="white" maxH="100vh">
      <Flex justifyContent="start" py="1rem">
        <Box display="flex" justifyContent="center" height="50px" mr="8px">
          <Image src={QuxPayLogo} height={50} width={50} alt="Qux Logo" />
        </Box>

        <Text color="primary" fontSize="3xl" textAlign="center">
          W<chakra.span color="white">allet</chakra.span>{' '}
        </Text>
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

        <Label label="Available Balance" image={QuxTokenIcon} amount={data?.balance} />
        <Label label="Deposits Pending" image={QuxTokenIcon} amount={data?.deposit} />
        <Label label="Withdraw Pending" image={QuxTokenIcon} amount={data?.withdraw_pending} />
      </Box>

      <TransactionHistory />
    </Container>
  );
};

export default Dashboard;
