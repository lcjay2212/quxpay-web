'use client';

import { Center, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

const DownloadPage: FC = () => {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor;

    try {
      // For iOS, use window.location.href with itms-apps://
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        window.location.href = 'itms-apps://itunes.apple.com/us/app/quxpay/id6499033621';
      }
      // For Android, use market:// to open Play Store app
      else if (/android/i.test(userAgent)) {
        window.location.href = 'market://details?id=com.qux.quxpay.android';
      }
      // For Desktop or other devices
      else {
        window.location.href = 'https://blog.quxpay.com/downloads/';
      }
    } catch (error) {
      // Fallback
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
