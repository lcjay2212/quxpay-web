import HeaderContainer from 'component/Header/HeaderContainer';
import SendQuxTokenWrapper from 'component/SendQuxTokenWrapper/SendQuxTokenWrapper';
import { FC } from 'react';

const SendQuxTokenPage: FC = () => (
  <HeaderContainer label="Send QUX ®Tokens" route="/dashboard">
    <SendQuxTokenWrapper />
  </HeaderContainer>
);

export default SendQuxTokenPage;
