import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, PaidPosInfoById } from 'component';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';

const PaidPosById: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['posHistoryById', router.query.id],
    queryFn: FETCH_POS_HISTORY_BY_ID,
  });

  return (
    <HeaderContainer label="Paid PO" route="/dashboard">
      <PaidPosInfoById data={data} loading={isLoading} />
    </HeaderContainer>
  );
};

export default PaidPosById;
