import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { QuxTokenIcon, QuxWalletIcon } from 'public/assets';
import { FC } from 'react';

const ItemListDisplay: FC<{ type: string; date: string; amount: string }> = ({ type, amount, date }) => (
  <Flex gap={8} height={100} mb="1rem">
    <Box height={80}>
      <Image src={QuxWalletIcon} height={80} width={100} alt="Qux Wallet" />
    </Box>
    <Box fontSize="xl">
      <Text>QUX Token {type}</Text>
      <Text>{date}</Text>
      <Flex alignItems="center">
        <span>
          <Image src={QuxTokenIcon} width={25} height={20} alt="Qux Token" />
        </span>
        {amount}
      </Flex>
    </Box>
  </Flex>
);

export default ItemListDisplay;
