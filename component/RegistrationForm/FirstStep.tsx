import { Checkbox } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
export const FirstStep: FC = () => {
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
        name="term_and_condition"
        rules={{ required: 'Please agree to the terms and conditions' }}
        render={({ field: { onChange, value }, fieldState: { error } }): ReactElement => (
          <FormContainer errorMessage={error?.message ?? ''}>
            <Checkbox color="white" value={value} onChange={onChange}>
              I agree to the{' '}
              <a
                href="https://qux.tv/terms-and-condition"
                target="_blank"
                // color="primary"
                // _hover={{
                //   cursor: 'pointer',
                //   textDecor: 'underline',
                // }}
                style={{ color: '#06A499' }}
                rel="noreferrer"
              >
                Terms and Conditions
              </a>
            </Checkbox>
          </FormContainer>
        )}
      />
    </>
  );
};
