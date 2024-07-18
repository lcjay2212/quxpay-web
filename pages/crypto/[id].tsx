import { HeaderContainer } from 'component/Header';
import { PosInfoById } from 'component/PosInfoById';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
import { getServerSideProps } from 'utils/getServerSideProps';

const CryptoHistoryById: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery(['posHistoryById', router.query.id], FETCH_POS_HISTORY_BY_ID, errorHandler);
  return (
    <HeaderContainer label="Open PO" route="/dashboard">
      <PosInfoById data={data} loading={isLoading} />
    </HeaderContainer>
  );
};

export { getServerSideProps };

export default CryptoHistoryById;
