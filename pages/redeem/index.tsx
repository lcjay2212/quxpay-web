import { Deposit, HeaderContainer } from 'component';
import { CongratulationContent } from 'component/CongratulationContent';
import { FC } from 'react';
import { useCongratulationContent } from 'store/useCongratulationContent';
import { getServerSideProps } from 'utils';

const RedeemPage: FC = () => {
  const visible = useCongratulationContent((e) => e.visible);
  return (
    <>
      {visible ? (
        <CongratulationContent label="Redeem" />
      ) : (
        <HeaderContainer label="Redeem" route="/dashboard" hasMenu>
          <Deposit label="Redeem" url="web/wallet/withdraw" url2="web/crypto/refund" />
        </HeaderContainer>
      )}
    </>
  );
};

export { getServerSideProps };

export default RedeemPage;
