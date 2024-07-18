import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FC } from 'react';
import { useTransactionHistoryFilterModal } from 'store/useTransactionHistoryFilterModal';

export const TransactionHistoryFilterModal: FC<{
  title: string;
  data: any;
  setValue: (val: string) => void;
  value: string;
}> = ({ title, data, value, setValue }) => {
  const [visible, setVisible] = useTransactionHistoryFilterModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size={{ base: 'full', md: '3xl' }} isCentered>
      <ModalOverlay />
      <ModalContent bg="blue.100">
        <ModalBody>
          <Flex flexDir="column" color="white" fontSize="0.85rem" justifyContent="space-between">
            <Text fontSize="1.25rem" fontWeight="bold" textAlign="center" my="1rem">
              Filter by {title}
            </Text>

            <Box mt="2rem">
              <RadioGroup onChange={setValue} value={value}>
                {data.map((item) => {
                  return (
                    <Box key={item.value}>
                      <Flex justifyContent="space-between" my="1rem">
                        <Flex>
                          {item?.icon && (
                            <Box mr="1rem">
                              <Image src={item.icon} alt={item.label} height={20} width={20} />
                            </Box>
                          )}
                          <Text>{item.label}</Text>
                        </Flex>
                        <Radio value={item.value} />
                      </Flex>
                      <Divider />
                    </Box>
                  );
                })}
              </RadioGroup>
            </Box>

            <Button mt="2rem" variant="primary" onClick={(): void => setVisible(!visible)}>
              Apply Filter
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
