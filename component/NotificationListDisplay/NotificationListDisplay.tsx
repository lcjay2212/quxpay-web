/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { BellIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';

const NotificationListDisplay: FC<{
  title: string;
  message: string;
  date: string;
  onClick?: () => void;
}> = ({ title, date, message, onClick }) => {
  return (
    <Flex justifyContent="space-between" onClick={onClick} cursor="pointer">
      <Flex gap={2} justifyContent="flex-start" alignItems="center" color="white">
        <Flex textAlign="center">
          <BellIcon color="#FDB851" w="3rem" height="3rem" />
          <Badge
            rounded="50%"
            bg="#DC4143"
            textAlign="center"
            mt={1}
            ml={-5}
            fontSize="10px"
            cursor="pointer"
            px="3px"
            py="2px"
            w="4"
            h="4"
          />
        </Flex>
        <Box fontSize="12px">
          <Flex justifyContent="space-between">
            <Text fontSize="14px" fontWeight="semibold" noOfLines={1}>
              {title}
            </Text>
            <Text w={28} fontWeight="semibold" fontSize="12px" textAlign="end">
              {date}
            </Text>
          </Flex>
          <Text noOfLines={1}>{message}</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NotificationListDisplay;
