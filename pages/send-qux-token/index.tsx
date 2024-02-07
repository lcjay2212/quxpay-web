import HeaderContainer from 'component/Header/HeaderContainer';
import SendQuxTokenWrapper from 'component/SendQuxTokenWrapper/SendQuxTokenWrapper';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const SendQuxTokenPage: FC = () => (
  <HeaderContainer label="Send QUX ®Tokens" route="/dashboard" hasMenu>
    <SendQuxTokenWrapper />
  </HeaderContainer>
);

export { getServerSideProps };

export default SendQuxTokenPage;
