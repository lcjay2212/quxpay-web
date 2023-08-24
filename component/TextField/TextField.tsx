import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Input, InputGroup, InputProps, InputRightElement, Spinner, Tooltip } from '@chakra-ui/react';
import { DATE_FORMAT } from 'constants/dateFormat';
import dayjs from 'dayjs';
import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { notify } from 'utils/notify';

export const TextField: FC<
  InputProps & {
    readOnly?: boolean;
    loading?: boolean;
    placeholder?: string;
    isPassword?: boolean;
    tooltip?: ReactElement | undefined;
    customRightElement?: ReactElement | undefined;
    removeTooltipOnScroll?: boolean | undefined;
    disablePasting?: boolean;
  }
> = ({
  loading,
  placeholder,
  readOnly,
  isPassword,
  tooltip,
  customRightElement,
  removeTooltipOnScroll,
  disablePasting,
  ...restProps
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [focused, setFocused] = useState(false);
  const listenScroll = useCallback(() => {
    setFocused(false);
  }, []);

  useEffect(() => {
    if (removeTooltipOnScroll) {
      window.addEventListener('wheel', listenScroll);

      return (): void => {
        void window.removeEventListener('wheel', listenScroll);
      };
    }

    return;
    // eslint-disable-next-line
  }, [removeTooltipOnScroll]);

  return (
    <Tooltip
      label={<Box p="2">{tooltip}</Box>}
      bg="white"
      hasArrow
      placement="top-end"
      isOpen={focused && Boolean(tooltip)}
    >
      <Box
        pos="relative"
        key={placeholder}
        onClick={(): void => {
          if (readOnly) {
            notify(`${placeholder ?? 'This field'} is read only`, { status: 'info' });
          }
        }}
      >
        {restProps.type === 'date' && (
          <Box
            pos="absolute"
            bg="transparent"
            zIndex={2}
            w="70%"
            h="100%"
            display="flex"
            alignItems="center"
            borderRadius="md"
            pl="1rem"
            fontSize="15px"
          >
            <Box bg="white" w="50%" h="50%" color={`${restProps.value ? 'black' : 'lightgray'}`}>
              {restProps.value ? dayjs(`${restProps.value}`).format(DATE_FORMAT) : DATE_FORMAT.toLowerCase()}
            </Box>
          </Box>
        )}

        <InputGroup>
          <Input
            onClick={(): void => setFocused(true)}
            onFocus={(): void => setFocused(true)}
            onMouseLeave={(): void => setFocused(false)}
            bg={loading ? 'lightgray' : 'gray.200'}
            border="1px solid #cccccc"
            borderRadius="16px"
            boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem"
            height="3.5rem"
            color="white"
            _placeholder={{
              color: 'gray',
            }}
            {...(readOnly && {
              _hover: {
                cursor: 'pointer',
              },
              readOnly: true,
            })}
            placeholder={placeholder}
            _disabled={{
              borderColor: 'white',
              bg: 'white',
              opacity: '0.4',
              cursor: 'not-allowed',
            }}
            _focus={{
              border: `2px solid`,
              borderColor: 'primary',
              bg: 'black',
            }}
            {...restProps}
            {...(isPassword && {
              type: hidePassword ? 'password' : 'text',
            })}
            {...(disablePasting && {
              onPaste: (e): void => {
                notify('Copy Pasting is not allowed', {
                  status: 'info',
                });
                e.preventDefault();
              },
            })}
          />

          {isPassword && (
            <InputRightElement mt="0.25rem">
              <Box
                h="1.25rem"
                onClick={(): void => setHidePassword((e) => !e)}
                cursor="pointer"
                transition="0.25s ease-in"
                color="white"
                _hover={{
                  color: 'primary',
                }}
              >
                {hidePassword ? <ViewIcon /> : <ViewOffIcon />}
              </Box>
            </InputRightElement>
          )}

          {customRightElement && <InputRightElement mt="0.25rem">{customRightElement}</InputRightElement>}

          {loading && (
            <Box pos="absolute" top={0} right={0} mt=".75rem" mr="1rem">
              <Spinner color="primary" />
            </Box>
          )}
        </InputGroup>
      </Box>
    </Tooltip>
  );
};
