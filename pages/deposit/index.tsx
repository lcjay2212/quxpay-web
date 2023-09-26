import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';

const DepositPage: FC = () => {
  return (
    <HeaderContainer label="Deposit" route="/dashboard">
      <Deposit label="Deposit" url="web/wallet/charge" url2="web/bankaccount/new" />
    </HeaderContainer>
  );
};

export default DepositPage;
