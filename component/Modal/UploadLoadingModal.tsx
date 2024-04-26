import {
  Flex, Modal,
  ModalBody,
  ModalContent, ModalOverlay, Spinner, Text
} from '@chakra-ui/react';
import { FC } from 'react';
import { useUploadLoadingModal } from 'store/useUploadLoadingModal';

const UploadLoadingModal: FC = () => {
  const [visible, setVisible] = useUploadLoadingModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">

        <ModalBody>
          <Flex
            flexDir={{ base: 'column', md: 'row' }}
            placeContent="center"
            alignItems="center"
            textAlign="center"
            my={{ base: '2rem', md: '15rem' }}
            bg='gray'
            borderRadius='xl'
            mx='3rem'
            py='2rem'
          >
            <Text color='white' mb='1rem' fontWeight='bold'>Uploading File</Text>
            <Spinner color='primary' size='xl' thickness='8px' />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadLoadingModal;
