'use client ';
import { Box } from '@chakra-ui/react';
import { HeaderContainer } from 'component';
import CryptoCharts from 'component/CryptoCharts/CryptoCharts';
import { FC } from 'react';

const CryptoPricePage: FC = () => {
  return (
    <HeaderContainer label="Crypto Prices" route="/dashboard">
      <Box>
        <CryptoCharts currency="BTC" key="btc-chart" />
        <CryptoCharts currency="ETH" key="eth-chart" />
      </Box>
    </HeaderContainer>
  );
};

export default CryptoPricePage;
