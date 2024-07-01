import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const RedeemPage: FC = () => (
  <HeaderContainer label="Redeem" route="/dashboard">
    <Deposit label="Redeem" url="web/wallet/withdraw" url2="web/crypto/refund" />
  </HeaderContainer>
);

export { getServerSideProps };

export default RedeemPage;
