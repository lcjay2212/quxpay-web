import { Checkbox } from '@chakra-ui/react';
import { FormContainer, TextField } from 'component';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { checkMinMax } from 'utils/checkMinMax';
import { hasMetCases } from 'utils/hasMetCases';
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
        rules={{
          required: 'Password is required',
          validate: {
            checkMinMax: (e): string | boolean => checkMinMax(8, 20, e) || 'Password must be 8-20 characters long',
            hasMetCase: (e): string | boolean =>
              hasMetCases(e, 3) ||
              'Password must contain symbols from at least three of the following four categories: lowercase letters, uppercase letters, numerical digits (0-9) and special characters (!,@,#,$,%,&,*,(,))',
          },
        }}
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
