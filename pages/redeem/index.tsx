import { CongratulationContent, Deposit, HeaderContainer } from 'component';
import { FC } from 'react';
import { useCongratulationContent } from 'store';
import { useSecurityMainFile } from 'store/useSecurityMainFile';
import { getServerSideProps } from 'utils';

const RedeemPage: FC = () => {
  const visible = useCongratulationContent((e) => e.visible);

  const { data, dataLoading } = useSecurityMainFile('wallets');

  // eslint-disable-next-line no-console
  console.log(data, dataLoading);

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
