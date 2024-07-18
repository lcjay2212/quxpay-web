/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Select, Text } from '@chakra-ui/react';
import { TextField } from 'component/TextField';
import { FC, useState } from 'react';
import { useProductModal } from 'store/useProductModal';
export const ProductModal: FC<{ data?: any }> = ({ data }) => {
  const [visible, setVisible] = useProductModal((e) => [e.visible, e.setVisible]);
  const setProductValue = useProductModal((e) => e.setProductValue);
  const setPrice = useProductModal((e) => e.setPrice);
  const [value, setValue] = useState('1');
  const [selectedVariant, setSelectedVariant] = useState<string>(data?.skus[0].sku);

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody color="white" pb={6} bg="gray">
          <Flex flexDir="column">
            <Text fontSize="14px" fontWeight="bold" my="1rem">
              Select Variation:
            </Text>
            <Select
              border="1px solid #cccccc"
              borderRadius="16px"
              boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
              height="3.5rem"
              color="white"
              bg="gray.200"
              _focus={{
                border: `2px solid`,
                borderColor: 'primary',
                bg: 'black',
              }}
              _placeholder={{
                color: 'gray',
              }}
              onClick={(e: any): void => setSelectedVariant(e.target.value)}
            >
              {data?.skus.map((item) => (
                <option key={item.id} style={{ background: 'gray.200' }} value={item?.sku}>
                  {item?.sku}
                </option>
              ))}
            </Select>
            <Text fontSize="14px" fontWeight="bold" my="1rem">
              Quantity:
            </Text>
            <TextField value={value} type="number" onChange={(e): void => setValue(e.target.value)} />
            <Button
              variant="primary"
              mt="1rem"
              onClick={(): void => {
                setProductValue([
                  {
                    sku: selectedVariant,
                    quantity: +value,
                  },
                ]);
                setVisible(!visible);
                setPrice(data?.skus[0].price);
              }}
            >
              Continue
            </Button>
            <Button
              variant="secondary"
              mt="1rem"
              onClick={(): void => {
                setProductValue(null);
                setVisible(!visible);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
