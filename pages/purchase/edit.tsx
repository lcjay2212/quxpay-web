import { EditBankForm } from 'component';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const EditDepositPage: FC = () => <EditBankForm label="Purchase" />;

export { getServerSideProps };

export default EditDepositPage;
