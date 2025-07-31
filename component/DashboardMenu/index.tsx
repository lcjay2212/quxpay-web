/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, chakra, Flex, Grid, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { isLocalHost } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useUploadLoadingModal, useUser } from 'store';
import { navigateWithNewTab, notify } from 'utils';

const DashboardMenu: FC = () => {
  const user = useUser((e) => e.user);
  const router = useRouter();
  const setVisible = useUploadLoadingModal((set) => set.setVisible);

  const { mutate, isSuccess } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/corporate/upload/transactions`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: () => {
      notify('Upload success!');
      setVisible(false);
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
      image: '/assets/icons/cash_in.webp',
      alt: 'Purchase',
      route: '/purchase',
      label: 'Purchase',
      show: true,
    },
    {
      image: '/assets/icons/withdraw_successful.webp',
      alt: 'Redeem',
      route: '/redeem',
      label: 'Redeem QUX eToken®',
      show: true,
    },
    {
      image: '/assets/icons/send_qux_cash.webp',
      alt: 'Send',
      route: '/send-qux-token',
      label: 'Send QUX eToken®',
      show: true,
    },
    {
      image: '/assets/icons/bills.webp',
      alt: 'Pay Bills',
      route: '/pay-bills',
      label: 'Pay Bills',
      show: isLocalHost(),
    },
    {
      image: '/assets/icons/upload-icon.webp',
      alt: 'Upload',
      route: '/',
      label: 'Upload CSV File',
      show: user?.corporate,
    },
    {
      image: '/assets/icons/send_qux_cash.webp',
      alt: 'Create',
      route: '/create-po',
      label: 'Create PO',
      show: user?.corporate,
    },
    {
      image: '/assets/icons/store white.svg',
      alt: 'Edit Store',
      route: isLocalHost()
        ? user?.has_store
          ? 'https://qa.quxtech.tv/dashboard/merchant-store/edit'
          : 'https://qa.quxtech.tv/dashboard/merchant-store'
        : user?.has_store
        ? 'https://qux.tv/dashboard/merchant-store/edit'
        : 'https://qux.tv/dashboard/merchant-store',
      label: user?.has_store ? 'Edit Store' : 'Create Store',
      show: user?.corporate,
    },
    {
      image: '/assets/icons/add.svg',
      alt: 'Add/Edit Products',
      route: isLocalHost()
        ? 'https://qa.quxtech.tv/dashboard/merchant-store/products'
        : 'https://qux.tv/dashboard/merchant-store/products',
      label: 'Add/Edit Products',
      show: user?.corporate && user.has_store,
    },

    {
      image: '/assets/icons/insight-icon.webp',
      alt: 'Insights',
      route: '/insights',
      label: 'Insights',
      show: isLocalHost(),
    },
    {
      image: '/assets/icons/user.webp',
      alt: 'Profile',
      route: '/profile',
      label: 'Profile',
      show: true,
    },
    {
      image: '/assets/icons/bills.webp',
      alt: 'Biller API',
      route: '/biller-api',
      label: 'Biller API',
      show: user?.corporate,
    },
    {
      image: '/assets/icons/crypto-price-icon.webp',
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
                      navigateWithNewTab(item.route, router);
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
