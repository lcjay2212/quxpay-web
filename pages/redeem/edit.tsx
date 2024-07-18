import { EditBankForm } from 'component/EditBankForm';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const EditRedeemPage: FC = () => <EditBankForm label="Redeem" />;

export { getServerSideProps };

export default EditRedeemPage;
