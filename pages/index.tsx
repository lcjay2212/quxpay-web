import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PhoneImage, QuxPayLogoTwo } from 'public/assets';
import { FC } from 'react';

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

const Home: FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Grid
      h="100vh"
      bgImage="url('/assets/images/BG.png')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize={3000}
      filter={isOpen ? 'blur(8px)' : ''}
    >
      <Container maxW="1920px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="flex" justifyContent="center">
            <Image src={QuxPayLogoTwo} height={100} width={250} alt="Qux Logo" />
          </Box>

          <Flex gap={4} alignItems="center">
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
              icon={<HamburgerIcon color="purple" h={35} w={35} />}
              onClick={onOpen}
            />
          </Flex>
        </Flex>

        <Flex placeContent="center">
          <Image src={PhoneImage} height={300} width={700} alt="Phone Image" />
        </Flex>
        <Text fontSize="37px" textTransform="uppercase" textAlign="center" color="white">
          Pay Like It's <br /> Nobody's Business.
          <br /> Because It Isn't.
        </Text>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
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
                onClick={onClose}
              />
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex placeContent="center" textAlign="center" my="15rem">
              {STATIC_DATA.map(({ image, label }) => (
                <Box maxW={200} key={label}>
                  <Box border="1px solid purple" borderRadius="xl">
                    <Image src={image} height={100} width={200} alt="test" />
                  </Box>
                  <Text fontSize="24px" color="white">
                    {label}
                  </Text>
                </Box>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default Home;
