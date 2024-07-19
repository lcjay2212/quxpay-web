import { CreatePoForm, HeaderContainer } from 'component';
import { FC } from 'react';

const CreatePo: FC = () => {
  return (
    <HeaderContainer label="Create PO" route="/dashboard">
      <CreatePoForm />
    </HeaderContainer>
  );
};

export default CreatePo;
