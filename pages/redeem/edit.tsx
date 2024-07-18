import { EditBankForm } from 'component';
import { FC } from 'react';
import { getServerSideProps } from 'utils';

const EditRedeemPage: FC = () => <EditBankForm label="Redeem" />;

export { getServerSideProps };

export default EditRedeemPage;
