import CreatePoForm from 'component/CreatePoForm';
import HeaderContainer from 'component/Header/HeaderContainer';
import { FC } from 'react';

const CreatePo: FC = () => {
  return (
    <HeaderContainer label="Create PO" route="/dashboard">
      <CreatePoForm />
    </HeaderContainer>
  );
};

export default CreatePo;
