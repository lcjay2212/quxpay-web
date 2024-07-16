import DeleteAccountWrapper from 'component/DeleteAccountWrapper/DeleteAccountWrapper';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const PurchaseDeletePage: FC = () => <DeleteAccountWrapper label="Purchase" />;

export { getServerSideProps };

export default PurchaseDeletePage;
