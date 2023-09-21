import { ArrowBackIcon } from '@chakra-ui/icons';
import { chakra, Container, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';

const HeaderContainer: FC<{ label?: string; route: string; children?: ReactElement }> = ({
  label,
  route,
  children,
}) => {
  const router = useRouter();
  return (
    <Container>
      <Flex mt="1rem">
        <ArrowBackIcon
          color="white"
          mt={label?.charAt(0) !== 'S' ? '1.30rem' : '1rem'}
          mr="1rem"
          cursor="pointer"
          onClick={(): void => void router.push(route)}
        />
        <Text color="primary" fontSize={label?.charAt(0) !== 'S' ? '4xl' : '3xl'} w={300}>
          {label?.charAt(0)}
          <chakra.span color="white">{label?.substring(1)}</chakra.span>
        </Text>
      </Flex>

      {children}
    </Container>
  );
};

export default HeaderContainer;
