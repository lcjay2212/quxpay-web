import { Box, Flex, Text } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import { QuxWalletIcon } from 'public/assets';
import { FC } from 'react';
import { defaultHash } from 'utils/defaultHastBlur';

const ItemListDisplay: FC<{ type: string; date: string; amount: string; complete: boolean, image: StaticImageData }> = ({
  type,
  amount,
  date,
  complete,
  image,
}) => (
  <Flex gap={4} height={100} >
    <Box height={80}>
      <Image
        src={QuxWalletIcon}
        height={50}
        width={70}
        alt="Qux Wallet"
        placeholder="blur"
        blurDataURL={defaultHash}
      />
    </Box>
    <Box fontSize="15px">
      <Text>QUX Token {type}</Text>
      <Text>
        {!complete ? 'Pending' : 'Completed'} {date}
      </Text>
      <Flex alignItems="center">
        <span>
          <Image src={image} width={25} height={20} alt="Qux Token" placeholder="empty" />
        </span>
        {amount}
      </Flex>
    </Box>
  </Flex>
);

export default ItemListDisplay;
