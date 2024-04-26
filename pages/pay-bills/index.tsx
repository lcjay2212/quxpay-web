import HeaderContainer from 'component/Header/HeaderContainer';
import PayBillsPageWrapper from 'component/PayBillsPageWrapper';
import { FC } from 'react';

const PayBillsPage: FC = () => (
  <HeaderContainer label="Pay bills" route="/dashboard">
    <PayBillsPageWrapper />
  </HeaderContainer>
);

export default PayBillsPage;
