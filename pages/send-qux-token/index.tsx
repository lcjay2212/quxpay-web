import { HeaderContainer, SendQuxTokenWrapper } from 'component';
import { FC } from 'react';
import { getServerSideProps } from 'utils';

const SendQuxTokenPage: FC = () => (
  <HeaderContainer label="Send QUX ®Tokens" route="/dashboard" hasMenu>
    <SendQuxTokenWrapper />
  </HeaderContainer>
);

export { getServerSideProps };

export default SendQuxTokenPage;
