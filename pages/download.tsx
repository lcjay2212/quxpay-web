'use client';

import { Center, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

const DownloadPage: FC = () => {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor;

    try {
      // For iOS, use window.location.href instead of replace() and use itms-apps:// protocol
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        // iOS needs special handling for App Store links
        window.location.href = 'itms-apps://apps.apple.com/us/app/quxpay/id6499033621';

        // Fallback in case the deep link doesn't work
        setTimeout(() => {
          window.location.href = 'https://apps.apple.com/us/app/quxpay/id6499033621';
        }, 500);
      }
      // For Android and other devices, use the original approach
      else {
        setTimeout(() => {
          if (/android/i.test(userAgent)) {
            window.location.replace('https://play.google.com/store/apps/details?id=com.qux.quxpay.android&hl=en-US');
          } else {
            // Desktop or other device fallback
            window.location.replace('https://blog.quxpay.com/downloads/');
          }
        }, 100);
      }
    } catch (error) {
      // Redirect to normal URL as fallback
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
