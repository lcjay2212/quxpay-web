import { CalendarIcon } from '@chakra-ui/icons';
import { Box, InputProps } from '@chakra-ui/react';
import { TextField } from 'component/TextField';
import { DATE_FORMAT } from 'constants/dateFormat';
import dayjs from 'dayjs';
import React, { forwardRef, MouseEventHandler, ReactElement, useState } from 'react';
import DatePicker from 'react-datepicker';

const CalendarInput = forwardRef<SVGSVGElement, Record<string, MouseEventHandler<SVGElement>>>((props, ref) => (
  <CalendarIcon cursor="pointer" color="white" ref={ref} onClick={props.onClick} />
));

type DateOfBirthPickerProps = {
  value: any; // eslint-disable-line
  onChange: (...event: any) => void; // eslint-disable-line
  onBlur: (e: React.FocusEventHandler) => void;
  tooltip?: ReactElement | undefined;
};

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps & InputProps> = ({
  value,
  onChange,
  onBlur,
  tooltip,
  ...restProps
}) => {
  const [dateFormat, setDateFormat] = useState(value);

  return (
    <Box boxShadow="rgba(100, 100, 111, 0.2) 0rem 0.438rem 1.813rem 0rem">
      <TextField
        {...restProps}
        tooltip={tooltip}
        isReadOnly
        boxShadow="md"
        value={dateFormat}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={DATE_FORMAT}
        id="date-of-birth"
        className="date-of-birth"
        max={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
        customRightElement={
          <DatePicker
            maxDate={dayjs().subtract(13, 'year').toDate()}
            customInput={<CalendarInput />}
            selected={value ? dayjs(value).date() : value}
            dropdownMode="select"
            onChange={(a: Date): void => {
              setDateFormat(dayjs(a).format(DATE_FORMAT));
              onChange(dayjs(a).format('YYYY-MM-DD'));
            }}
            showYearDropdown
          />
        }
      />
    </Box>
  );
};
