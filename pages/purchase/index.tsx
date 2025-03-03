import { CongratulationContent, Deposit, HeaderContainer } from 'component';
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
          <Deposit label="Purchase" url="web/validate/token-purchase" url2="web/bankaccount/new" />
        </HeaderContainer>
      )}
    </>
  );
};

export { getServerSideProps };

export default DepositPage;
