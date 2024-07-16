/* eslint-disable @typescript-eslint/no-explicit-any */
import EditBankForm from 'component/EditBankForm/EditBankForm';
import { FC } from 'react';
import { getServerSideProps } from 'utils/getServerSideProps';

const EditRedeemPage: FC = () => <EditBankForm />;

export { getServerSideProps };

export default EditRedeemPage;
