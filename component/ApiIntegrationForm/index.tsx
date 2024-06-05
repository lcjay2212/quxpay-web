import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import { STAGING_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { notify } from 'utils/notify';

const ApiIntegrationForm: FC = () => {
  const router = useRouter();
  const method = useForm();
  const { control, handleSubmit } = method;

  const { mutate, isLoading } = useMutation(
    (variable) =>
      axios.post(`${STAGING_URL}/web/biller/submit/api-info`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    {
      onSuccess: ({ data }) => {
        void router.push('/dashboard');
        notify(data?.status?.message);
      },
      onError: () => {
        notify(`Failed to send request`, { status: 'error' });
      },
    }
  );

  const onSubmit = (val): void => void mutate(val);

  return (
    <Box color="white" mt="1rem">
      <Text fontSize="18px">API Integration Request</Text>

      <Box mt="1rem">
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="documentation_url"
              rules={{ required: 'Documentation URL is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField
                    value={value || ''}
                    placeholder="Your Postman or Documentation URL"
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="technical_contact_name"
              rules={{ required: 'Technical Contact Name is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField
                    value={value || ''}
                    placeholder="Technical Contact Name"
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="technical_contact_email"
              rules={{ required: 'Technical Contact Email is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField
                    value={value || ''}
                    placeholder="Technical Contact Email"
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="technical_contact_phone"
              rules={{ required: 'Technical Contact Phone is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField
                    value={value || ''}
                    placeholder="Technical Contact Phone"
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="api_key"
              rules={{ required: 'API Key is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField value={value || ''} placeholder="API Key" onChange={onChange} onBlur={onBlur} />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="token"
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                <FormContainer errorMessage={error?.message ?? ''}>
                  <TextField
                    value={value || ''}
                    placeholder="API Token/Passphrase (Optional)"
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormContainer>
              )}
            />

            <Controller
              control={control}
              name="comment"
              render={({ field: { onChange, value, onBlur } }): ReactElement => (
                <FormContainer>
                  <Textarea
                    bg="#10101F"
                    border="1px solid #4D4D6B"
                    borderRadius="16px"
                    height="3.5rem"
                    color="white"
                    _placeholder={{
                      color: 'gray',
                    }}
                    _focus={{
                      border: `2px solid`,
                      borderColor: 'primary',
                      bg: 'black',
                    }}
                    placeholder="Comments:"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    py="1rem"
                    h="200px"
                  />
                </FormContainer>
              )}
            />

            <Flex flexDir="column" gap={4} mt="1rem">
              <Button variant="primary" borderRadius="1rem" h="3.25rem" type="submit" isLoading={isLoading}>
                Send Request
              </Button>
              <Button
                variant="secondary"
                borderRadius="1rem"
                h="3.25rem"
                onClick={(): void => void router.push('/dashboard')}
                isLoading={isLoading}
              >
                Cancel
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default ApiIntegrationForm;
