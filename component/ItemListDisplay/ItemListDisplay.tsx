/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Box, Flex, Text } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import { QuxPayGreenIcon } from 'public/assets';
import { FC } from 'react';

export const ItemListDisplay: FC<{
  label?: string;
  date?: string;
  amount: number;
  complete?: boolean;
  image: StaticImageData;
  type?: string;
  onClick?: () => void;
  hasComplete?: boolean;
}> = ({ label, amount, date, complete, image, onClick, type, hasComplete }) => {
  return (
    <Flex justifyContent="space-between" onClick={onClick} cursor="pointer">
      <Flex m="0.5rem" gap={4} justifyContent="space-between" alignItems="center">
        <Image src={image} height={50} width={50} alt="Qux Wallet" />
        <Box fontSize="12px">
          <Text>{label}</Text>
          {hasComplete && <Text>{!complete ? 'Pending' : 'Completed'}</Text>}
          {type && <Text>{type}</Text>}
        </Box>
      </Flex>

      <Flex flexDir="column" justifyContent="center" alignItems="flex-end" fontSize="12px">
        <Text fontWeight="semibold">{date}</Text>
        <Flex>
          <Image src={QuxPayGreenIcon} width={15} alt="Qux Token" />
          <Text color="green.800">{amount.toFixed(2)}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
