import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, IconButton } from '@chakra-ui/react';
import { HomeModal } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogoPng } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store';

export const TopBarHeader: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = useHomePageModal(({ visible, setVisible }) => [visible, setVisible]);

  return (
    <Container maxW="1080px" bg="transparent" p={0} pr={{ base: '1rem', md: 0 }}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="center" cursor="pointer" onClick={(): void => void router.push('/')}>
          <Image
            src={QuxPayLogoPng}
            height={100}
            width={150}
            alt="Qux Logo"
            style={{ objectFit: 'contain' }}
            placeholder="empty"
          />
        </Box>

        <Flex gap={4} alignItems="center" display={!visible ? 'flex' : 'none'}>
          <Button
            display={{ base: 'none', md: 'block' }}
            variant="primary"
            borderRadius="3xl"
            w={150}
            h={50}
            onClick={(): void => void router.push('/login')}
          >
            Log In
          </Button>
          <Button
            display={{ base: 'none', md: 'block' }}
            variant="secondary"
            borderRadius="3xl"
            w={150}
            h={50}
            onClick={(): void => void router.push('/register')}
          >
            Register
          </Button>
          <IconButton
            mr={{ base: '1rem', md: 0 }}
            bg="transparent"
            _active={{ bg: 'transparent' }}
            _hover={{ bg: 'transparent' }}
            aria-label="hamburger"
            icon={
              <HamburgerIcon
                color="purple"
                _active={{
                  color: 'white',
                }}
                h={35}
                w={35}
              />
            }
            onClick={(): void => setVisible(!visible)}
          />
        </Flex>
      </Flex>
      <HomeModal />
    </Container>
  );
};
