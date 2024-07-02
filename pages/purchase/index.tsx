import CongratulationContent from 'component/CongratulationContent/CongratulationContent';
import Deposit from 'component/Deposit/Deposit';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';
import { useCongratulationContent } from 'store/useCongratulationContent';
import { getServerSideProps } from 'utils/getServerSideProps';

const DepositPage: FC = () => {
  const visible = useCongratulationContent((e) => e.visible);
  return (
    <>
      {!visible ? (
        <CongratulationContent label="Purchase" />
      ) : (
        <HeaderContainer label="Purchase" route="/dashboard" hasMenu>
          <Deposit label="Purchase" url="web/wallet/charge" url2="web/bankaccount/new" />
        </HeaderContainer>
      )}
    </>
  );
};

export { getServerSideProps };

export default DepositPage;
