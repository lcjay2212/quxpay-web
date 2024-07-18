import { CongratulationContent } from 'component/CongratulationContent';
import Deposit from 'component/Deposit/Deposit';
import { HeaderContainer } from 'component/Header';
import { FC } from 'react';
import { useCongratulationContent } from 'store/useCongratulationContent';
import { getServerSideProps } from 'utils/getServerSideProps';

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
