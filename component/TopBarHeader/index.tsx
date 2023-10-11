import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, IconButton } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxPayLogoPng } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store/useHomePageModal';

const TopBarHeader: FC = () => {
  const router = useRouter();
  const [visible, setVisible] = useHomePageModal(({ visible, setVisible }) => [visible, setVisible]);

  return (
    <Container maxW="1080px" bg="transparent">
      <Flex justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="center">
          <Image
            src={QuxPayLogoPng}
            height={100}
            width={150}
            alt="Qux Logo"
            placeholder="blur"
            style={{ objectFit: 'contain' }}
            blurDataURL={'data:image/jpeg...'}
          />
        </Box>

        <Flex gap={4} alignItems="center">
          <Button variant="primary" borderRadius="3xl" w={150} h={50} onClick={(): void => void router.push('/login')}>
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
            onClick={(): void => setVisible(!visible)}
          />
        </Flex>
      </Flex>
    </Container>
  );
};

export default TopBarHeader;
