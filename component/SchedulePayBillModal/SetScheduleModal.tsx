import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Select, Text } from '@chakra-ui/react';
import { FormContainer } from 'component/FormInput';
import { TextField } from 'component/TextField';
import dayjs from 'dayjs';
import { startCase } from 'lodash';
import { FC, ReactElement } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { useSetScheduleModal } from 'store/useSetScheduleModal';
const SetScheduleModal: FC<{
  startDate?: any;
  setStartDate?: any;
  endDate?: any;
  setEndDate?: any;
  filter?: any;
  setFilter?: any;
}> = ({ startDate, setStartDate, endDate, setEndDate, filter, setFilter }) => {
  const { control } = useFormContext();
  const [visible, setVisible] = useSetScheduleModal((state) => [state.visible, state.setVisible]);

  const repeatDatePicker = (dates): void => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const FREQUENCY = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Modal isOpen={visible} onClose={(): void => setVisible(!visible)} size="2xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        display="flex"
        justifyContent="flex-end"
        bg="#10101F"
        minH={filter === 'repeat' ? 640 : 400}
        h="auto"
        mt={filter === 'repeat' ? '32rem' : '42rem'}
        borderTopRadius="3rem"
        color="white"
        overflow="hidden"
        pt="1rem"
      >
        <ModalBody>
          <Flex mt="2rem" flexDir="column" justifyContent="space-between" gap={2}>
            <Box>
              <Text>Set schedule of payment</Text>

              <Controller
                control={control}
                name="scheduled_type"
                rules={{ required: 'Date is required' }}
                render={({ field: { onChange } }): ReactElement => (
                  <Box
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around"
                    borderRadius="md"
                    border="1px solid #06A499"
                    color="white"
                    my="1rem"
                  >
                    {[
                      { label: 'Repeat', value: 'repeat' },
                      { label: 'Schedule once', value: 'once' },
                    ].map((item) => (
                      <Text
                        key={item.value}
                        py="0.5rem"
                        w="350px"
                        bg={filter === item.value ? 'primary' : 'transparent'}
                        color="white"
                        borderRadius="md"
                        onClick={(): void => {
                          onChange(item.value || filter);
                          setFilter(item.value);
                        }}
                      >
                        {startCase(item.label)}
                      </Text>
                    ))}
                  </Box>
                )}
              />
              {filter === 'repeat' && (
                <Box>
                  <Controller
                    control={control}
                    name="start_date"
                    rules={{ required: 'Date is required' }}
                    render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="Choose Date">
                        <TextField
                          value={dayjs(startDate).format('YYYY-MM-DD') + ' to ' + dayjs(endDate).format('YYYY-MM-DD')}
                          placeholder="Select date"
                          onChange={onChange}
                          onBlur={onBlur}
                          customRightElement={
                            <Box>
                              <DatePicker
                                // customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                                // selected={value ? dayjs(value).date() : value}
                                // dropdownMode="select"
                                // popperPlacement="top-end"
                                // popperProps={{ strategy: 'fixed' }}
                                // onChange={(a: Date): void => {
                                //   onChange(dayjs(a).format('YYYY-MM-DD'));
                                // }}
                                // showYearDropdown
                                customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                                popperProps={{ strategy: 'fixed' }}
                                dropdownMode="select"
                                popperPlacement="top-end"
                                selected={startDate}
                                onChange={repeatDatePicker}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                              />
                            </Box>
                          }
                        />
                      </FormContainer>
                    )}
                  />
                  {/* <Controller
                    control={control}
                    name="end_date"
                    rules={{ required: 'End Date is required' }}
                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="Choose End Date">
                        <TextField
                          value={value}
                          placeholder="Select end date"
                          onChange={onChange}
                          onBlur={onBlur}
                          customRightElement={
                            <Box>
                              <DatePicker
                                customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                                selected={value ? dayjs(value).date() : value}
                                dropdownMode="select"
                                popperPlacement="top-end"
                                popperProps={{ strategy: 'fixed' }}
                                onChange={(a: Date): void => {
                                  onChange(dayjs(a).format('YYYY-MM-DD'));
                                }}
                                showYearDropdown
                              />
                            </Box>
                          }
                        />
                      </FormContainer>
                    )}
                  /> */}
                  <Controller
                    control={control}
                    name="frequency"
                    rules={{ required: 'Frequency is required' }}
                    render={({ field: { onChange }, fieldState: { error } }): ReactElement => (
                      <FormContainer errorMessage={error?.message ?? ''} label="Frequency">
                        <Select
                          border="1px solid #4D4D6B"
                          borderRadius="16px"
                          height="3.5rem"
                          color="white"
                          bg="#10101F"
                          _focus={{
                            border: `2px solid`,
                            borderColor: 'primary',
                            bg: 'black',
                          }}
                          _placeholder={{
                            color: 'gray',
                          }}
                          onClick={(e: any): void => onChange(e.target.value)}
                        >
                          {FREQUENCY.map((item) => {
                            return (
                              <option key={item.value} style={{ background: 'black' }} value={item.value}>
                                {item.label}
                              </option>
                            );
                          })}
                        </Select>
                      </FormContainer>
                    )}
                  />
                </Box>
              )}
              {filter === 'once' && (
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: 'Date is required' }}
                  render={({ field: { onChange, value, onBlur }, fieldState: { error } }): ReactElement => (
                    <FormContainer errorMessage={error?.message ?? ''} label="Choose Date">
                      <TextField
                        value={value}
                        placeholder="Select a date"
                        onChange={onChange}
                        onBlur={onBlur}
                        customRightElement={
                          <Box>
                            <DatePicker
                              customInput={<CalendarIcon w={25} h={25} mt="0.5rem" mr="1rem" color="primary" />}
                              selected={value ? dayjs(value).date() : value}
                              dropdownMode="select"
                              popperPlacement="top-end"
                              popperProps={{ strategy: 'fixed' }}
                              onChange={(a: Date): void => {
                                onChange(dayjs(a).format('YYYY-MM-DD'));
                              }}
                              showYearDropdown
                            />
                          </Box>
                        }
                      />
                    </FormContainer>
                  )}
                />
              )}
            </Box>

            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              h="3.25rem"
              mt="2rem"
              onClick={(): void => setVisible(false)}
            >
              Next
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SetScheduleModal;
