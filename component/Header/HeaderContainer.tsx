import { ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';
import { chakra, Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import { useAccountPaymentId } from 'store/useAccountPaymentId';
import { notify } from 'utils/notify';

const HeaderContainer: FC<{ label?: string; route: string; children?: ReactElement }> = ({
  label,
  route,
  children,
}) => {
  const router = useRouter();
  const paymentId = useAccountPaymentId((e) => e.paymentId);
  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex mt="1rem" alignItems="center">
          <ArrowBackIcon color="white" mr="1rem" cursor="pointer" onClick={(): void => void router.push(route)} />
          <Text color="primary" fontSize={label?.charAt(0) !== 'S' ? '4xl' : '3xl'} w={300}>
            {label?.charAt(0)}
            <chakra.span color="white">{label?.substring(1)}</chakra.span>
          </Text>
        </Flex>
        {label !== 'Withdrawal' && (
          <Menu>
            <MenuButton bg="color.dark" _active={{ bg: 'color.dark' }} as={IconButton} icon={<HamburgerIcon />} />
            <MenuList>
              {label === 'Deposit' && (
                <>
                  <MenuItem
                    onClick={(): void => {
                      if (!paymentId) {
                        notify('Please select Bank Account', { status: 'warning' });
                      } else {
                        void router.push('/deposit/edit');
                      }
                    }}
                  >
                    Edit Account
                  </MenuItem>
                  <MenuItem onClick={(): void => void router.push('/deposit/delete')}>Delete Account</MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        )}
      </Flex>

      {children}
    </Container>
  );
};

export default HeaderContainer;
