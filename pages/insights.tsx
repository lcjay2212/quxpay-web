import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_INSIGHTS } from 'constants/api';
import { startCase } from 'lodash';
import { MONTHS } from 'mocks/month';
import Image from 'next/image';
import { QuxTokenBigIcon } from 'public/assets';
import { FC, useState } from 'react';
import { useQuery } from 'react-query';

const TextBox: FC<{ value: number; label: string }> = ({ value, label }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    bg="primary"
    py="0.5rem"
    px="1rem"
    borderRadius="xl"
    mb="1rem"
  >
    <Box fontSize={20} fontWeight="bold">
      {label}
    </Box>
    <Flex>
      <Image src={QuxTokenBigIcon} height={25} width={25} alt="Qux Logo" placeholder="empty" />
      <Text color="white" fontSize={25}>
        {value}
      </Text>
    </Flex>
  </Flex>
);

const InsightPage: FC = () => {
  const [filter, setFilter] = useState('monthly');
  const [monthFilter, setMonthFilter] = useState('02');
  const [label, setLabel] = useState('Febuary');
  const [expensesFilter, setExpensesFilter] = useState('income');

  const { data } = useQuery({
    queryKey: ['transactionHistoryPhaseTwo', filter, monthFilter],
    queryFn: FETCH_INSIGHTS,
  });

  return (
    <>
      <HeaderContainer label="Spending Insights" route="/dashboard">
        <Box mx="1rem">
          <Box
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            borderRadius="2xl"
            border="1px solid white"
            mx="5rem"
            color="white"
            my="2rem"
          >
            {['daily', 'monthly'].map((item) => (
              <Text
                key={item}
                py="0.25rem"
                w="150px"
                bg={filter === item ? 'primary' : 'black'}
                color="white"
                borderRadius="2xl"
                onClick={(): void => setFilter(item)}
              >
                {startCase(item)}
              </Text>
            ))}
          </Box>

          <Box mb="2rem">
            <Text color="white">{label}</Text>
            <Flex>
              <Image src={QuxTokenBigIcon} height={50} width={50} alt="Qux Logo" placeholder="empty" />
              <Text color="white" fontSize={50}>
                {data?.total?.total_expenses.toFixed(2)}
              </Text>
            </Flex>
          </Box>

          {filter === 'monthly' && (
            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              {MONTHS.map((item) => (
                <Text
                  bg={monthFilter === item.value ? 'primary' : 'black'}
                  key={item.label}
                  color="white"
                  textAlign="center"
                  borderRadius="xl"
                  border="1px solid gray"
                  p="0.25rem"
                  fontSize="12px"
                  onClick={(): void => {
                    setMonthFilter(item.value);
                    setLabel(item.label);
                  }}
                >
                  {item.label}
                </Text>
              ))}
            </Grid>
          )}
        </Box>
      </HeaderContainer>

      <Box bg="blue.100" mt="1rem" py="1.5rem" h="60vh" borderTopRadius="32px" color="white">
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          borderRadius="md"
          border="1px solid white"
          mx="2rem"
          color="white"
          my="2rem"
        >
          {['income', 'expenses'].map((item) => (
            <Text
              key={item}
              py="0.5rem"
              w="200px"
              bg={expensesFilter === item ? 'primary' : 'transparent'}
              color="white"
              borderRadius="md"
              onClick={(): void => setExpensesFilter(item)}
            >
              {startCase(item)}
            </Text>
          ))}
        </Box>

        {expensesFilter === 'income' && (
          <Flex flexDir="column" mx="2rem">
            <TextBox label="Send by friends" value={data?.income.token_from_friends.toFixed(2)} />
            <TextBox label="Purchase Order" value={data?.income.purchase_orders.toFixed(2)} />
            <TextBox label="Purchase Token" value={data?.income.purchase_tokens.toFixed(2)} />
          </Flex>
        )}
        {expensesFilter === 'expenses' && <>expenses</>}
      </Box>
    </>
  );
};

export default InsightPage;
