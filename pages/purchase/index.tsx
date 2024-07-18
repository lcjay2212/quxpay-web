import { Deposit, HeaderContainer } from 'component';
import { CongratulationContent } from 'component/CongratulationContent';
import { FC } from 'react';
import { useCongratulationContent } from 'store';
import { getServerSideProps } from 'utils';

const DepositPage: FC = () => {
  const visible = useCongratulationContent((e) => e.visible);
  return (
    <>
      {visible ? (
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
