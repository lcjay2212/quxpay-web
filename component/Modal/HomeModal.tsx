import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import router from 'next/router';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    image: '/assets/images/1.png',
    label: 'Military-Grade Security',
  },
  {
    image: '/assets/images/2.png',
    label: 'NO MIDDLEMAN. NO NONSENSE.',
  },
  {
    image: '/assets/images/3.png',
    label: 'P2P Payments Made Perfect',
  },
  {
    image: '/assets/images/4.png',
    label: 'Transfers in a Flash',
  },
  {
    image: '/assets/images/1.png',
    label: 'The Future of Payments. Today.',
  },
];
const HomeModal: FC = () => {
  const [visible, setVisible] = useHomePageModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="full">
      <ModalOverlay />
      <ModalContent bg="transparent">
        <ModalHeader>
          <Flex gap={4} alignItems="center" justifyContent="flex-end" mt="1.5rem">
            <Button
              variant="primary"
              borderRadius="3xl"
              w={150}
              h={50}
              onClick={(): void => void router.push('/login')}
            >
              Log In
            </Button>
            <Button
              variant="secondary"
              borderRadius="3xl"
              w={150}
              h={50}
              onClick={(): void => void router.push('/register')}
            >
              Register
            </Button>

            <IconButton
              bg="transparent"
              _active={{ bg: 'transparent' }}
              _hover={{ bg: 'transparent' }}
              aria-label="hamburger"
              icon={<CloseIcon color="purple" h={35} w={35} />}
              onClick={(): void => setVisible(!visible)}
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Flex placeContent="center" textAlign="center" my="15rem">
            {STATIC_DATA.map(({ image, label }) => (
              <Box maxW={250} key={label}>
                <Box border="1px solid purple" borderRadius="xl">
                  <Image src={image} height={100} width={250} alt="test" />
                </Box>
                <Text my="1rem" fontSize="20px" color="white">
                  {label}
                </Text>
              </Box>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HomeModal;
