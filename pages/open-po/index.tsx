import { Text } from '@chakra-ui/react';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';
import { useUser } from 'store/useUser';

const OpenPosHistory: FC = () => {
  const { user } = useUser();

  return (
    <HeaderContainer label={!user?.corporate ? 'Unpaid POs' : 'Open POs'} route="/dashboard">
      <Text>Test</Text>
    </HeaderContainer>
  );
};

export default OpenPosHistory;
