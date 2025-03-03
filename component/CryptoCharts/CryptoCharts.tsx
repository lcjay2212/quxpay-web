'use client ';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ChartOptions, createChart } from 'lightweight-charts';
import { FC, useEffect, useRef, useState } from 'react';

const CryptoCharts: FC<{ currency: string }> = ({ currency }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState('5_years');

  const dateFilter = [
    {
      value: 'last_24_hours',
      label: '24H',
    },
    {
      value: '7_days',
      label: '7D',
    },
    {
      value: '1_month',
      label: '1M',
    },
    {
      value: '6_months',
      label: '6M',
    },
    {
      value: '1_year',
      label: '1Y',
    },
    {
      value: '5_years',
      label: '5Y',
    },
    {
      value: 'all',
      label: 'ALL',
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: [`${currency}graph`, filter],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/web/crypto/graph?filter=${filter}&currency=${currency}`,
        {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
            Version: 2,
          },
        }
      );

      return data.data;
    },
  });

  const convertData = data
    ?.map((item) => {
      const startTimestamp = Math.floor(new Date(item.start_date).getTime() / 1000);
      return {
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        time: startTimestamp, // Use only start date for the `time` field
      };
    })
    .sort((a, b) => a.time - b.time);

  // Define chart options outside the useEffect
  const chartOptions = {
    layout: {
      textColor: 'white',
      background: { type: 'solid', color: 'black' },
      attributionLogo: false,
    },
    grid: {
      vertLines: {
        visible: false, // Hide vertical grid lines
      },
      horzLines: {
        visible: false, // Hide horizontal grid lines
      },
    },
    rightPriceScale: {
      visible: false,
    },
    timeScale: {
      visible: false,
    },
  } as ChartOptions;

  useEffect(() => {
    if (!convertData || isLoading || convertData.length === 0) return;

    const chart = createChart(chartContainerRef.current as HTMLElement, chartOptions);
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(convertData);
    chart.timeScale().fitContent();

    return () => chart.remove(); // Clean up the chart on component unmount
  }, [convertData, isLoading]);

  return (
    <Box borderBottom="1px solid white" mb="2rem">
      <Text fontSize="2rem" fontWeight="bold" color="white">
        {currency}
      </Text>
      <Box justifyContent="center" pr="2rem" textAlign="center" alignItems="center">
        <Box my="1rem" px="1rem" ref={chartContainerRef} height={{ base: 200, md: 400 }} />
      </Box>
      <Flex flexDirection="row" justifyContent="space-between" mx="2rem" mb="1rem" fontWeight="bold">
        {dateFilter.map((item) => (
          <Text
            key={item.value}
            cursor="pointer"
            color={filter === item.value ? 'primary' : 'white'}
            onClick={(): void => {
              setFilter(item.value);
            }}
          >
            {item.label}
          </Text>
        ))}
      </Flex>
    </Box>
  );
};

export default CryptoCharts;
