import DeleteAccountWrapper from 'component/DeleteAccountWrapper/DeleteAccountWrapper';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const RedeemDeletePage: FC = () => <DeleteAccountWrapper label="Redeem" />;

export { getServerSideProps };

export default RedeemDeletePage;
