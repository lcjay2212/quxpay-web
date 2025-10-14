import { ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import {
  useAccountPaymentId,
  useHomePageModal,
  usePage,
  usePendingAccountModal,
  useProductModal,
  useType,
} from 'store';

export const HeaderContainer: FC<{ label?: string; route: string; children?: ReactElement; hasMenu?: boolean }> = ({
  label,
  route,
  children,
  hasMenu,
}) => {
  const router = useRouter();
  const setPaymentData = useAccountPaymentId((e) => e.setPaymentData);
  const setProductValue = useProductModal((e) => e.setProductValue);
  const setVisible = useHomePageModal((e) => e.setVisible);
  const setPendingAccountModalVisible = usePendingAccountModal((e) => e.setVisible);
  const setType = useType((e) => e.setType);
  const setPage = usePage((e) => e.setPage);

  const handleBackNavigation = (): void => {
    setProductValue(null);
    setVisible(false);
    setPendingAccountModalVisible(false);
    setPaymentData(null);
    setType(null);
    void router.push(route);
    setPage(0);
  };

  // Dynamic font size based on label length
  const getFontSize = (): { base: string; sm: string; md: string } => {
    if (!label) return { base: '2xl', sm: '3xl', md: '4xl' };
    if (label.length > 15) return { base: 'xl', sm: '2xl', md: '3xl' };
    return { base: '2xl', sm: '3xl', md: '4xl' };
  };

  return (
    <Box maxW="720px" mx="auto" px={{ base: '0.5rem', sm: '1rem' }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        py={{ base: '0.75rem', md: '1rem' }}
        gap={{ base: '0.5rem', sm: '1rem' }}
      >
        <Flex alignItems="center" gap={{ base: '0.5rem', sm: '1rem' }} flex="1" minW="0">
          <Tooltip label="Go back" placement="bottom" hasArrow>
            <IconButton
              aria-label="Go back"
              icon={<ArrowBackIcon />}
              onClick={handleBackNavigation}
              variant="ghost"
              colorScheme="whiteAlpha"
              color="white"
              size={{ base: 'sm', md: 'md' }}
              minW={{ base: '32px', md: '40px' }}
              _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
              _active={{ bg: 'whiteAlpha.300' }}
              transition="all 0.2s"
            />
          </Tooltip>

          {label === 'Wallet' && (
            <Box flexShrink={0} display={{ base: 'none', sm: 'block' }}>
              <Image src="/assets/images/qux-logo.webp" height={35} width={100} alt="Qux Logo" />
            </Box>
          )}

          <Text color="primary" fontSize={getFontSize()} fontWeight="bold" w="auto" minW="0" isTruncated flex="1">
            {label?.charAt(0)}
            <Text as="span" color="white">
              {label?.substring(1)}
            </Text>
          </Text>

          {label === 'Checkout' && (
            <Box flexShrink={0}>
              <Image src="/assets/icons/unpaid-history-icon.webp" height={30} width={30} alt="Checkout" />
            </Box>
          )}
        </Flex>

        {hasMenu && (
          <Menu>
            <Tooltip label="Menu" placement="bottom" hasArrow>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                aria-label="Open menu"
                bg="transparent"
                color="white"
                size={{ base: 'sm', md: 'md' }}
                _hover={{ bg: 'whiteAlpha.200' }}
                _active={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
              />
            </Tooltip>
            <MenuList bg="gray.800" borderColor="gray.600" boxShadow="xl">
              {label === 'Purchase' && (
                <>
                  <MenuItem
                    onClick={(): void => void router.push('/manage-payments')}
                    _hover={{ bg: 'gray.700' }}
                    _focus={{ bg: 'gray.700' }}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    Manage Payments
                  </MenuItem>
                </>
              )}
              {label === 'Send QUX eToken®' && (
                <>
                  <MenuItem
                    onClick={(): void => void router.push('/send-qux-token/delete')}
                    _hover={{ bg: 'gray.700' }}
                    _focus={{ bg: 'gray.700' }}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    Delete Friends
                  </MenuItem>
                </>
              )}
              {label === 'Redeem' && (
                <>
                  <MenuItem
                    onClick={(): void => void router.push('/manage-payments')}
                    _hover={{ bg: 'gray.700' }}
                    _focus={{ bg: 'gray.700' }}
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    Manage Payments
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        )}

        {label === 'Transactions' && (
          <Tooltip label="Download transactions" placement="bottom" hasArrow>
            <IconButton
              aria-label="Download transactions"
              icon={
                <Box>
                  <Image src="/assets/icons/upload-icon.webp" height={25} width={25} alt="Download" />
                </Box>
              }
              onClick={(): void => void router.push('/transaction/download')}
              variant="ghost"
              colorScheme="whiteAlpha"
              size={{ base: 'sm', md: 'md' }}
              _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
              _active={{ bg: 'whiteAlpha.300' }}
              transition="all 0.2s"
            />
          </Tooltip>
        )}
      </Flex>

      {children}
    </Box>
  );
};
