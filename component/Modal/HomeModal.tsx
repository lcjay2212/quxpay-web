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
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const STATIC_DATA = [
  {
    image: '/assets/images/1.png',
    label: 'Military-Grade Security',
    routes: '/military-grade-security',
  },
  {
    image: '/assets/images/2.png',
    label: 'NO MIDDLEMAN. NO NONSENSE.',
    routes: '/no-middleman',
  },
  {
    image: '/assets/images/3.png',
    label: 'P2P Payments Made Perfect',
    routes: '/payments-made-perfect',
  },
  {
    image: '/assets/images/4.png',
    label: 'Transfers in a Flash',
    routes: '/transfers',
  },
  {
    image: '/assets/images/1.png',
    label: 'The Future of Payments. Today.',
    routes: '/',
  },
];
const HomeModal: FC = () => {
  const router = useRouter();
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
              bg="purple"
              borderRadius="50%"
              _active={{ bg: 'purple' }}
              _hover={{ bg: 'purple' }}
              aria-label="hamburger"
              icon={<CloseIcon color="white" h="20px" w="20px" />}
              onClick={(): void => setVisible(!visible)}
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Flex
            flexDir={{ base: 'column', md: 'row' }}
            justifyContent="center"
            placeContent="center"
            alignItems="center"
            textAlign="center"
            my="15rem"
          >
            {STATIC_DATA.map(({ image, label, routes }) => (
              <Box maxW={250} key={label}>
                <Box
                  border="1px solid purple"
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={(): void => {
                    void router.push(routes);
                    setVisible(!visible);
                  }}
                >
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
