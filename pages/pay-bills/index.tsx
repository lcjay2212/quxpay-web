import { HeaderContainer, PayBillsPageWrapper } from 'component';
import { FC } from 'react';

const PayBillsPage: FC = () => (
  <HeaderContainer label="Pay bills" route="/dashboard">
    <PayBillsPageWrapper />
  </HeaderContainer>
);

export default PayBillsPage;
