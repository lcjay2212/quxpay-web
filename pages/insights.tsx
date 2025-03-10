import { Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { HeaderContainer } from 'component';
import { FETCH_INSIGHTS } from 'constants/api';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import { MONTHS } from 'mocks/month';
import Image from 'next/image';
import { QuxTokenBigIcon } from 'public/assets';
import { FC, useState } from 'react';

const TextBox: FC<{ value: number; label: string; isLoading: boolean }> = ({ value, label, isLoading }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    bg="primary"
    py="0.5rem"
    px="1rem"
    borderRadius="xl"
    mb="1rem"
    h="3.5rem"
  >
    <Box fontSize={20} fontWeight="bold">
      {label}
    </Box>
    {!isLoading ? (
      <Flex>
        <Image src={QuxTokenBigIcon} height={25} width={25} alt="Qux Logo" placeholder="empty" />
        <Text color="white" fontSize={25}>
          {value}
        </Text>
      </Flex>
    ) : (
      <Spinner size="md" />
    )}
  </Flex>
);

const InsightPage: FC = () => {
  const [filter, setFilter] = useState('monthly');

  const [monthFilter, setMonthFilter] = useState(dayjs().format('MM'));
  const [dayFilter] = useState(dayjs().format('DD'));
  const dayOrMonthFilter = filter === 'monthly' ? monthFilter : dayFilter;
  const [label, setLabel] = useState('Febuary');
  const [expensesFilter, setExpensesFilter] = useState('income');
  const { data, isLoading } = useQuery({
    queryKey: ['transactionHistoryPhaseTwo', filter, dayOrMonthFilter],
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
              <Box color="white" fontSize={50}>
                {expensesFilter === 'income' ? (
                  <>{!isLoading ? data?.total?.total_income.toFixed(2) : <Spinner size="lg" color="primary" />}</>
                ) : (
                  <>{!isLoading ? data?.total?.total_expenses.toFixed(2) : <Spinner size="lg" color="primary" />}</>
                )}
              </Box>
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

      <Box
        bg="blue.100"
        py="1.5rem"
        h="60vh"
        borderTopRadius="32px"
        color="white"
        maxW="container.md"
        textAlign="center"
        mx="auto"
        mt="2rem"
      >
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
              w="350px"
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
            <TextBox label="Sent by friends" value={data?.income.token_from_friends.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Purchase Order" value={data?.income.purchase_orders.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Purchase Token" value={data?.income.purchase_tokens.toFixed(2)} isLoading={isLoading} />
          </Flex>
        )}
        {expensesFilter === 'expenses' && (
          <Flex flexDir="column" mx="2rem">
            <TextBox label="PO" value={data?.expenses.po.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Purchase" value={data?.expenses.purchase.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Redeem QUX eToken®" value={data?.expenses.redeem_tokens.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Send to friend" value={data?.expenses.send_qux_tokens.toFixed(2)} isLoading={isLoading} />
            <TextBox label="Services" value={data?.expenses.services.toFixed(2)} isLoading={isLoading} />
          </Flex>
        )}
      </Box>
    </>
  );
};

export default InsightPage;
