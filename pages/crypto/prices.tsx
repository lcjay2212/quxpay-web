'use client ';
import { Box } from '@chakra-ui/react';
import { HeaderContainer } from 'component';
import { createChart } from 'lightweight-charts';
import { FC, useEffect, useRef } from 'react';

const CryptoPricePage: FC = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
    };

    const chart = createChart(chartContainerRef.current as any, chartOptions as any);

    const baselineSeries = chart.addBaselineSeries({
      baseValue: { type: 'price', price: 25 },
      topLineColor: 'rgba( 38, 166, 154, 1)',
      topFillColor1: 'rgba( 38, 166, 154, 0.28)',
      topFillColor2: 'rgba( 38, 166, 154, 0.05)',
      bottomLineColor: 'rgba( 239, 83, 80, 1)',
      bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
      bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
    });

    const data = [
      { value: 1, time: 1642425322 },
      { value: 8, time: 1642511722 },
      { value: 10, time: 1642598122 },
      { value: 20, time: 1642684522 },
      { value: 3, time: 1642770922 },
      { value: 43, time: 1642857322 },
      { value: 41, time: 1642943722 },
      { value: 43, time: 1643030122 },
      { value: 56, time: 1643116522 },
      { value: 46, time: 1643202922 },
    ];

    baselineSeries.setData(data as any);

    chart.timeScale().fitContent();

    return () => chart.remove(); // Clean up the chart on component unmount
  }, []);

  return (
    <HeaderContainer label="Crypto Prices" route="/dashboard">
      <Box my="1rem" px="1rem" ref={chartContainerRef} height={400} />
    </HeaderContainer>
  );
};

export default CryptoPricePage;
