/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { isLocalHost, STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  BillsIcon,
  CashIn,
  CryptoPriceIcon,
  InsightIcon,
  ProfileIcon,
  SendQuxCash,
  UploadIcon,
  WithdrawSuccessful,
} from 'public/assets';
import { FC, useEffect } from 'react';
import { usePosHistory, useUploadLoadingModal, useUser } from 'store';
import { notify } from 'utils';

const DashboardMenu: FC = () => {
  const user = useUser((e) => e.user);
  const router = useRouter();
  const setVisible = useUploadLoadingModal((set) => set.setVisible);

  const { refetch } = usePosHistory();

  const { mutate, isSuccess } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${STAGING_URL}/web/corporate/upload/transactions`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify('Upload success!');
      setVisible(false);
      refetch();
    },
    onError: ({ response }: any) => {
      notify(`${response.data?.data.format}`, { status: 'error' });
      setVisible(false);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setVisible(true);
    }
  }, [isSuccess, setVisible]);

  const dashboardMenu = [
    {
      image: CashIn,
      alt: 'Purchase',
      route: '/purchase',
      label: 'Purchase',
      show: true,
    },
    {
      image: WithdrawSuccessful,
      alt: 'Redeem',
      route: '/redeem',
      label: 'Redeem Tokens',
      show: true,
    },
    {
      image: SendQuxCash,
      alt: 'Send',
      route: '/send-qux-token',
      label: 'Send Qux® Token',
      show: true,
    },
    {
      image: BillsIcon,
      alt: 'Pay Bills',
      route: '/pay-bills',
      label: 'Pay Bills',
      show: isLocalHost(),
    },
    {
      image: UploadIcon,
      alt: 'Upload',
      route: '/',
      label: 'Upload CSV File',
      show: user?.corporate,
    },
    {
      image: SendQuxCash,
      alt: 'Create',
      route: '/create-po',
      label: 'Create PO',
      show: user?.corporate,
    },
    {
      image: InsightIcon,
      alt: 'Insights',
      route: '/insights',
      label: 'Insights',
      show: isLocalHost(),
    },
    {
      image: ProfileIcon,
      alt: 'Profile',
      route: '/profile',
      label: 'Profile',
      show: true,
    },
    {
      image: BillsIcon,
      alt: 'Biller API',
      route: '/biller-api',
      label: 'Biller API',
      show: user?.corporate,
    },
    {
      image: CryptoPriceIcon,
      alt: 'Crypto Price',
      route: '/crypto/prices',
      label: 'Crypto Price',
      show: isLocalHost(),
    },
  ];

  return (
    <Grid
      templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }}
      gap={{ base: 2, md: 6 }}
      bg="blue.100"
      py="1rem"
      px="1.5rem"
      borderRadius="xl"
    >
      {dashboardMenu
        .filter((q) => q.show)
        .map((item) => (
          <Box key={item.alt}>
            {item.show && (
              <Box key={item.label}>
                <chakra.input
                  type="file"
                  id="Upload"
                  display="none"
                  onChange={(e: any): void => {
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    mutate(formData as any);
                  }}
                />
                <chakra.label
                  htmlFor={item.alt}
                  key={item.alt}
                  w={100}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{
                    color: 'primary',
                  }}
                  id={item.alt}
                  onClick={(): void => {
                    if (item.alt !== 'Upload') {
                      void router.push(item.route);
                    }
                  }}
                >
                  <Flex justifyContent="center" width="auto" height={50}>
                    <Image
                      src={item.image}
                      width={item.alt === 'Upload' ? 45 : 55}
                      height={50}
                      alt={item.alt}
                      placeholder="empty"
                    />
                  </Flex>
                  <Text mt="0.5rem" fontSize={{ base: '0.75rem', md: '1rem' }}>
                    {item.label}
                  </Text>
                </chakra.label>
              </Box>
            )}
          </Box>
        ))}
    </Grid>
  );
};

export default DashboardMenu;
