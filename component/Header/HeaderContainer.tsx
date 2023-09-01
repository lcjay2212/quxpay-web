import { ArrowBackIcon } from '@chakra-ui/icons';
import { chakra, Container, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';

const HeaderContainer: FC<{ firstLeter?: string; label?: string; route: string; children?: ReactElement }> = ({
  firstLeter,
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
          mt="1.30rem"
          mr="1rem"
          cursor="pointer"
          onClick={(): void => void router.push(route)}
        />
        <Text color="primary" fontSize="4xl" w={300}>
          {firstLeter}
          <chakra.span color="white">{label}</chakra.span>
        </Text>
      </Flex>

      {children}
    </Container>
  );
};

export default HeaderContainer;
