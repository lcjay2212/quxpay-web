import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const DepositPage: FC = () => {
  return (
    <HeaderContainer label="Purchase" route="/dashboard" hasMenu>
      <Deposit label="Purchase" url="web/wallet/charge" url2="web/bankaccount/new" />
    </HeaderContainer>
  );
};

export { getServerSideProps };

export default DepositPage;
