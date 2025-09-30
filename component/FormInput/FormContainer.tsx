import { Box, BoxProps, Flex, FormControl, FormErrorMessage, FormLabel, SlideFade } from '@chakra-ui/react';
import { FC } from 'react';
type FormProps = {
  label?: string;
  errorMessage?: string;
  hideErrorMessage?: boolean;
  place?: 'start' | 'end';
};

export const FormContainer: FC<FormProps & BoxProps> = ({
  label,
  children,
  errorMessage,
  hideErrorMessage,
  place = 'start',
  ...rest
}) => (
  <FormControl isInvalid={Boolean(errorMessage)}>
    <Box mb={{ base: '3', md: '5' }} {...rest}>
      {label && (
        <Flex justifyContent={place}>
          <FormLabel
            fontSize="1rem"
            mb="0.5rem"
            color="white"
            htmlFor={label}
            {...(!label && {
              h: '1.3125rem',
            })}
            ml="1rem"
          >
            {label === 'max'
              ? ''
              : // <Flex>
                //   <Text>Maximum Amount Available</Text>
                //   <Box ml={2} display="flex" justifyContent="center" alignItems="center">
                //     <Image src='/assets/icons/qux-token.webp' height={20} width={20} alt="Qux Logo" placeholder="empty" />
                //   </Box>
                //   <Text>100</Text>
                // </Flex>
                label}
          </FormLabel>
        </Flex>
      )}
      {children}
      {errorMessage && !hideErrorMessage && (
        <SlideFade in={true} offsetY="-1rem">
          <FormErrorMessage fontSize="0.9rem" mb="0" color="error">
            {errorMessage}
          </FormErrorMessage>
        </SlideFade>
      )}
    </Box>
  </FormControl>
);
