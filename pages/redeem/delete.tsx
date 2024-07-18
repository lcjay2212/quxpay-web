import { DeleteAccountWrapper } from 'component';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const RedeemDeletePage: FC = () => <DeleteAccountWrapper label="Redeem" />;

export { getServerSideProps };

export default RedeemDeletePage;
