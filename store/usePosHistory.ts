/* eslint-disable @typescript-eslint/no-explicit-any */
import { FETCH_POS_HISTORY } from "constants/api";
import { useQuery } from "react-query";
import errorHandler from "utils/errorHandler";

const usePosHistory = (): { unpaidData: any, paidData: any, isLoading: boolean, refetch: () => void } => {

    const { data, isLoading, refetch } = useQuery('posHistory', FETCH_POS_HISTORY, errorHandler);

    const unpaidData = data?.unpaid_or_open
    const paidData = data?.paid

    return {
        unpaidData, paidData, isLoading, refetch
    }
}

export default usePosHistory