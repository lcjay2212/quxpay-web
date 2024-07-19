import { DeleteAccountWrapper } from 'component';
import { FC } from 'react';
import { getServerSideProps } from 'utils';

const PurchaseDeletePage: FC = () => <DeleteAccountWrapper label="Purchase" />;

export { getServerSideProps };

export default PurchaseDeletePage;
