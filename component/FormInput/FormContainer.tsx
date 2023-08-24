import { Box, BoxProps, FormControl, FormErrorMessage, FormLabel, SlideFade } from '@chakra-ui/react';
import { FC } from 'react';
type FormProps = {
  label: string;
  errorMessage?: string;
  hideErrorMessage?: boolean;
};

export const FormContainer: FC<FormProps & BoxProps> = ({
  label,
  children,
  errorMessage,
  hideErrorMessage,
  ...rest
}) => (
  <FormControl isInvalid={Boolean(errorMessage)}>
    <Box mb={{ base: '3', md: '5' }} {...rest}>
      <FormLabel
        fontSize="1rem"
        mb="0.3rem"
        color="white"
        htmlFor={label}
        {...(!label && {
          h: '1.3125rem',
        })}
        ml="1rem"
      >
        {label}
      </FormLabel>
      {children}
      {errorMessage && !hideErrorMessage && (
        <SlideFade in={true} offsetY="-1rem">
          <FormErrorMessage fontSize="0.9rem" mb="0" color="basecolor">
            {errorMessage}
          </FormErrorMessage>
        </SlideFade>
      )}
    </Box>
  </FormControl>
);
