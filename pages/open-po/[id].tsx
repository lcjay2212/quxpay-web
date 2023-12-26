import HeaderContainer from 'component/Header/HeaderContainer';
import POSInfoById from 'component/POSInfoById';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const POSHistryById: FC = () => {
    const router = useRouter();
    const { data, isLoading } = useQuery(['posHistoryById', router.query.id], FETCH_POS_HISTORY_BY_ID, errorHandler);

    return (
        <HeaderContainer label="Open PO" route="/dashboard">
            <POSInfoById data={data} loading={isLoading} />
        </HeaderContainer>
    );
};

export default POSHistryById