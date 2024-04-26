import HeaderContainer from 'component/Header/HeaderContainer';
import PaidPosInfoById from 'component/PaidPosInfoById';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const PaidPosById: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery(['posHistoryById', router.query.id], FETCH_POS_HISTORY_BY_ID, errorHandler);

  return (
    <HeaderContainer label="Paid PO" route="/dashboard">
      <PaidPosInfoById data={data} loading={isLoading} />
    </HeaderContainer>
  );
};

export default PaidPosById;
