import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';

const WithdrawalPage: FC = () => (
  <HeaderContainer label="Withdrawal" route="/dashboard">
    <Deposit label="Withdrawal" url="web/wallet/withdraw" />
  </HeaderContainer>
);

export default WithdrawalPage;
