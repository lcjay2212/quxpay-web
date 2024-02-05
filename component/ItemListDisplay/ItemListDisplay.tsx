import { Box, Flex, Text } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import { QuxTokenIcon } from 'public/assets';
import { FC } from 'react';

const ItemListDisplay: FC<{
  label: string;
  date: string;
  amount: string;
  complete: boolean;
  image: StaticImageData;
  onClick?: () => void;
}> = ({ label, amount, date, complete, image, onClick }) => {
  return (
    <Flex justifyContent="space-between" onClick={onClick} cursor="pointer">
      <Flex m="0.5rem" gap={4} justifyContent="space-between" alignItems="center">
        <Image src={image} height={50} width={50} alt="Qux Wallet" />
        <Box fontSize="12px">
          <Text>{label}</Text>
          <Text>{!complete ? 'Pending' : 'Completed'}</Text>
        </Box>
      </Flex>

      <Flex flexDir="column" justifyContent="center" alignItems="flex-end" fontSize="12px">
        <Text fontWeight="semibold">{date}</Text>
        <Flex color="primary">
          <Image src={QuxTokenIcon} width={25} alt="Qux Token" />
          <Text fontSize="1rem">{amount}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemListDisplay;
