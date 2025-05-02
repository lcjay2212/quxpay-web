'use client';

import { Center, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

const DownloadPage: FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.qux.quxpay.android&hl=en-US';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      window.location.href = 'https://apps.apple.com/us/app/quxpay/id6499033621';
    } else {
      window.location.href = 'https://blog.quxpay.com/downloads/';
    }
  }, []);

  return (
    <Center h="100vh" flexDirection="column">
      <Spinner size="xl" mb={4} />
      <Text fontSize="lg">Redirecting...</Text>
    </Center>
  );
};

export default DownloadPage;
