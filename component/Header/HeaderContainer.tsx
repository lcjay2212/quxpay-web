import { ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxLogo } from 'public/assets';
import { FC, ReactElement } from 'react';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import { useHomePageModal } from 'store/useHomePageModal';
import { useProductModal } from 'store/useProductModal';
import { defaultHash } from 'utils/defaultHastBlur';
import { notify } from 'utils/notify';

const HeaderContainer: FC<{ label?: string; route: string; children?: ReactElement }> = ({
  label,
  route,
  children,
}) => {
  const router = useRouter();
  const paymentId = useAccountPaymentId((e) => e.paymentId);
  const setProductValue = useProductModal((e) => e.setProductValue);
  const setVisible = useHomePageModal((e) => e.setVisible);
  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex mt="1rem" alignItems="center">
          <ArrowBackIcon
            color="white"
            mr="1rem"
            cursor="pointer"
            onClick={(): void => {
              setProductValue(null);
              setVisible(false);
              void router.push(route);
            }}
          />
          {label === 'Wallet' && (
            <Image src={QuxLogo} height={35} width={100} alt="Qux Logo" placeholder="blur" blurDataURL={defaultHash} />
          )}
          <Text color="primary" fontSize={label?.charAt(0) !== 'S' ? '4xl' : '3xl'} w={300}>
            {label?.charAt(0)}
            <span style={{ color: 'white' }}>{label?.substring(1)}</span>
          </Text>
        </Flex>
        {label === 'Wallet' ? (
          <></>
        ) : (
          <>
            {label !== 'Redeem' && (
              <Menu>
                <MenuButton bg="color.dark" _active={{ bg: 'color.dark' }} as={IconButton} icon={<HamburgerIcon />} />
                <MenuList>
                  {label === 'Purchase' && (
                    <>
                      <MenuItem
                        onClick={(): void => {
                          if (!paymentId) {
                            notify('Please select Bank Account', { status: 'warning' });
                          } else {
                            void router.push('/purchase/edit');
                          }
                        }}
                      >
                        Edit Account
                      </MenuItem>
                      <MenuItem onClick={(): void => void router.push('/purchase/delete')}>Delete Account</MenuItem>
                    </>
                  )}
                  {label === 'Send QUX ®Tokens' && (
                    <>
                      <MenuItem onClick={(): void => void router.push('/send-qux-token/delete')}>
                        Delete Friends
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            )}
          </>
        )}
      </Flex>

      {children}
    </Container>
  );
};

export default HeaderContainer;
