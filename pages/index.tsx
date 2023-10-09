import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
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
    <>
      <Grid
        h="100vh"
        bgImage="url('/assets/images/BG.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        filter={isOpen ? 'blur(8px)' : ''}
      >
        <Container maxW="1080px">
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
      </Grid>

      <Box
        h="130vh"
        bgImage="url('/assets/images/BG-2.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Container maxW="1080px">
          <Flex h="100vh" alignItems="center">
            <Box w={400} color="white">
              <Heading fontSize="60px" fontWeight="normal">
                Military-Grade <br /> Security
              </Heading>
              <Text fontSize="30px" my="1.5rem">
                QuxPay utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box bg="#3D075F">
        <Container maxW="1080px">
          <Flex alignItems="center">
            <Box color="white">
              <Heading fontSize="60px" fontWeight="normal">
                NO MIDDLEMAN.
                <br />
                NO NONSENSE.
              </Heading>
              <Text fontSize="30px" my="1.5rem" w={400}>
                Unlike others, QuxPay has no hidden fees and will never sell your data for profit. What you see is what
                you get.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        bgImage="url('/assets/images/BG-3.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        py="10rem"
      >
        <Container maxW="1080px">
          <Flex h="60vh" alignItems="center">
            <Box color="white">
              <Heading fontSize="60px" fontWeight="normal">
                P2P Payments <br />
                Made Perfect
              </Heading>
              <Text fontSize="30px" w={400} my="1.5rem">
                Pay friends, family, contacts instantly. No fees, no limits. Spend on the move.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        bgImage="url('/assets/images/BG-4.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        py="12rem"
      >
        <Container maxW="1080px">
          <Flex h="100vh" alignItems="center">
            <Box w={400} color="white">
              <Heading fontSize="60px" fontWeight="normal">
                Transfers in <br /> a Flash
              </Heading>
              <Text fontSize="30px" my="1.5rem">
                Amount transferred through QuxPay reaches its destination almost instantly. As quick as sending a text.
                No more waiting around like crypto.
              </Text>
              <Button variant="seeMore">See more</Button>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default Home;
