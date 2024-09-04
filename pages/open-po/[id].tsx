import { useQuery } from '@tanstack/react-query';
import { HeaderContainer, PosById } from 'component';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { getServerSideProps } from 'utils';

const PosHistoryById: FC = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['posHistoryById', router.query.id],
    queryFn: FETCH_POS_HISTORY_BY_ID,
  });
  return (
    <HeaderContainer label="Open PO" route="/dashboard">
      <PosById data={data} loading={isLoading} />
    </HeaderContainer>
  );
};

export { getServerSideProps };

export default PosHistoryById;
