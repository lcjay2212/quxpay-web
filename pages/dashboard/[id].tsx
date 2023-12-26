import HeaderContainer from 'component/Header/HeaderContainer';
import { FETCH_POS_HISTORY_BY_ID } from 'constants/api';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

const POSHistryById: FC = () => {
    const router = useRouter();
    console.log(router.query.id)
    const { data } = useQuery(['posHistoryById', router.query.id], FETCH_POS_HISTORY_BY_ID, errorHandler);

    console.log(data)

    return (
        <HeaderContainer label="Open PO" route="/dashboard">
            <>TEST</>
        </HeaderContainer>
    );
};

export default POSHistryById