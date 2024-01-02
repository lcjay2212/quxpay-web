import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { TextField } from 'component/TextField'
import { FC, useState } from 'react'
import { useProductModal } from 'store/useProductModal'
const ProductModal: FC<{ data?: any }> = ({ data }) => {
    const [visible, setVisible] = useProductModal((e) => [e.visible, e.setVisible])
    const [value, setValue] = useState<number>()
    return (
        <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size='sm' isCentered  >
            <ModalOverlay />
            <ModalContent>
                <ModalBody color='white' pb={6} bg='gray'  >
                    <Flex flexDir='column'>
                        <Text fontSize='14px' fontWeight='bold' my='1rem'>
                            Select Variation:
                        </Text>
                        <TextField value={data?.name} />

                        <Text fontSize='14px' fontWeight='bold' my='1rem'>
                            Quantity:
                        </Text>
                        <TextField value={value} type='number' onChange={(e): void => setValue(+e.target.value)} />
                        <Button variant='primary' mt='1rem' onClick={(): void => setVisible(!visible)}>
                            Continue
                        </Button>
                        <Button variant='secondary' mt='1rem' onClick={(): void => setVisible(!visible)}>
                            Cancel
                        </Button>
                    </Flex>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

export default ProductModal