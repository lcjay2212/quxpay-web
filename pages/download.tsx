'use client';

import { Button, Center, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

const DownloadPage: FC = () => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const userAgent = navigator.userAgent || navigator.vendor;

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setPlatform('ios');
      // Try auto redirect
      window.location.href = 'itms-apps://itunes.apple.com/us/app/quxpay/id6499033621';
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
      window.location.href = 'market://details?id=com.qux.quxpay.android';
    } else {
      setPlatform('other');
      window.location.href = 'https://blog.quxpay.com/downloads/';
    }

    // If auto redirect fails or is blocked, show button after 2 sec
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleManualRedirect = (): void => {
    try {
      if (platform === 'ios') {
        window.location.href = 'itms-apps://itunes.apple.com/us/app/quxpay/id6499033621';
      } else if (platform === 'android') {
        window.location.href = 'market://details?id=com.qux.quxpay.android';
      } else {
        window.location.href = 'https://blog.quxpay.com/downloads/';
      }
    } catch {
      window.location.href = 'https://blog.quxpay.com/downloads/';
    }
  };

  return (
    <Center h="100vh" flexDirection="column">
      <Spinner size="xl" mb={4} />
      <Text fontSize="lg" mb={4}>
        Redirecting...
      </Text>

      {showButton && (
        <Button colorScheme="teal" onClick={handleManualRedirect}>
          {platform === 'ios' ? 'Open in App Store' : platform === 'android' ? 'Open in Play Store' : 'Download App'}
        </Button>
      )}
    </Center>
  );
};

export default DownloadPage;
