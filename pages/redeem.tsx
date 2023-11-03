import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';

const RedeemPage: FC = () => (
  <HeaderContainer label="Redeem" route="/dashboard">
    <Deposit label="Redeem" url="web/wallet/withdraw" />
  </HeaderContainer>
);

export default RedeemPage;
