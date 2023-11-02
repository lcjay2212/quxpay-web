import { Text } from '@chakra-ui/react';
import { DateOfBirthPicker } from 'component/DateOfBirthPicker';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
const FirstStep: FC = () => {
  const { control, getValues } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Email" errorMessage={error?.message ?? ''}>
            <TextField
              type="email"
              value={value ?? ''}
              placeholder="Enter your email"
              onChange={(e): void => {
                onChange(e.target.value.toLowerCase());
              }}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Password" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter your password"
              onChange={onChange}
              onBlur={onBlur}
              isPassword
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="password_confirmation"
        rules={{
          required: 'Password Confirmation is Required',
          validate: {
            passwordsMatch: (e): boolean | string => e === getValues().password || 'Passwords Must Match',
          },
        }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Password Confirmation" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Confirm password"
              onChange={onChange}
              onBlur={onBlur}
              isPassword
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="username"
        rules={{ required: 'Username is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Username" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Choose your username" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="date_of_birth"
        rules={{ required: 'Birthday is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Birthday" errorMessage={error?.message ?? ''}>
            <DateOfBirthPicker
              value={value ?? ''}
              onChange={onChange}
              onBlur={onBlur}
              tooltip={
                value ? undefined : error?.message ? (
                  <Text color="red">❌ {error.message}</Text>
                ) : (
                  <Text color="White">✔️ Please Select Birthdate</Text>
                )
              }
            />
          </FormContainer>
        )}
      />
    </>
  );
};

export default FirstStep;
