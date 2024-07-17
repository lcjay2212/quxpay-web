import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

const ErrorPage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      void router.push('/');
    }, 5000);
  }, [router]);

  return (
    <Box
      h="100vh"
      bgImage="url('/assets/images/404.webp')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize={{ base: 'contain', md: 'cover' }}
    />
  );
};

export default ErrorPage;
