import { Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { startCase } from 'lodash';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { blockInvalidChar } from 'utils';

export const CorporationStep: FC = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name="el_number"
        rules={{ required: 'El Number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="El Number" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter El Number"
              onChange={onChange}
              onKeyDown={blockInvalidChar}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="corporation_name"
        rules={{ required: 'Corporation Name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Corporation Name" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Corporation Name" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="business_license"
        rules={{ required: 'Business License is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Business License" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Business License" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Text color="white" fontSize="26px" my="1.5rem">
        Contact Person
      </Text>

      <Controller
        control={control}
        name="contact_person_firstname"
        rules={{ required: 'First Name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="First Name" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter First Name" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="contact_person_lastname"
        rules={{ required: 'Last Name is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Last Name" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Last Name" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="contact_person_phone"
        rules={{ required: 'Phone Number is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Phone" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Phone e.g. 505-555-5555"
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={blockInvalidChar}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="contact_person_email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Email" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Email" onChange={onChange} onBlur={onBlur} type="email" />
          </FormContainer>
        )}
      />

      <Text color="white" fontSize="26px" my="1.5rem">
        Company Address
      </Text>

      <Controller
        control={control}
        name="mailing_address"
        rules={{ required: 'Mailing Address is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Mailing Address" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. 123 Street Ave"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="address_2"
        render={({ field: { onChange, value, onBlur } }): ReactElement => (
          <FormContainer label="Address 2">
            <TextField
              value={value ?? ''}
              placeholder="Enter Address e.g. Suite, Apt"
              onChange={onChange}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="city"
        rules={{ required: 'City is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="City" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter City"
              onChange={(e): void => {
                onChange(startCase(e.target.value));
              }}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="state"
        rules={{ required: 'State is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="State" errorMessage={error?.message ?? ''}>
            <TextField
              value={value ?? ''}
              placeholder="Enter State"
              onChange={(e): void => {
                onChange(startCase(e.target.value));
              }}
              onBlur={onBlur}
            />
          </FormContainer>
        )}
      />

      <Controller
        control={control}
        name="zip"
        rules={{ required: 'Zip is required' }}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
          <FormContainer label="Zip" errorMessage={error?.message ?? ''}>
            <TextField value={value ?? ''} placeholder="Enter Zip Code" onChange={onChange} onBlur={onBlur} />
          </FormContainer>
        )}
      />
    </>
  );
};
