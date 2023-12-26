import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import { QuxTokenIcon } from 'public/assets';
import { FC } from 'react';
import { defaultHash } from 'utils/defaultHastBlur';

const ItemListDisplay: FC<{ type: string; date: string; amount: string; complete: boolean, image: StaticImageData, showBtn?: boolean, onClick?: () => void }> = ({
  type,
  amount,
  date,
  complete,
  image,
  showBtn,
  onClick
}) => {
  return (
    <Flex height={100} justifyContent='space-between' >
      <Flex gap={4}>
        <Box height={80}>
          <Image
            src={image}
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
              <Image src={QuxTokenIcon} width={25} height={20} alt="Qux Token" placeholder="empty" />
            </span>
            {amount}
          </Flex>
        </Box>
      </Flex>
      {showBtn && <Flex alignItems='center'>
        <ArrowForwardIcon onClick={onClick} />
      </Flex>}
    </Flex>
  )
};

export default ItemListDisplay;
