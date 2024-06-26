import { Box, Flex, Text } from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import { FormContainer } from 'component/FormInput';
import { ValueLabelProps } from 'component/RegistrationForm/FinalStep';
import Image from 'next/image';
import { ClipboardIcon } from 'public/assets';
import { FC, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import { notify } from 'utils/notify';

export const reactSelectStyles = {
  menu: (provided: CSSObject): CSSObject => ({
    ...provided,
    marginTop: 5,
  }),
  control: (provided: CSSObject): CSSObject => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '16px',
    color: 'white',
  }),
  indicatorsContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    display: 'none',
    color: 'white',
  }),
  valueContainer: (provided: CSSObject): CSSObject => ({
    ...provided,
    padding: 13,
    fontSize: '1rem',
    border: '1px solid #4D4D6B',
    borderRadius: '16px',
    background: '#10101F',
    textAlign: 'start',
    color: 'white',
    ':active': {
      background: '#000000',
      borderColor: '#06A499',
    },
  }),
  singleValue: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
  input: (provided: CSSObject): CSSObject => ({
    ...provided,
    color: 'white',
  }),
};

const CashInCrypto: FC = () => {
  const { control, watch } = useFormContext();
  // const [searchText, setSearchText] = useState('America');

  // const debounceText = useDebounce(searchText, 1000);

  const data = [
    {
      currency: 'BTC',
      buy_rate: '57454.1008',
      buy_network_processing_fee: '0.00005654',
    },
    {
      currency: 'ETH',
      buy_rate: '3167.4091',
      buy_network_processing_fee: '0.00042597',
    },
    {
      currency: 'LTC',
      buy_rate: '66.3945',
      buy_network_processing_fee: '0.00001226',
    },
    {
      currency: 'BCH',
      buy_rate: '357.6750',
      buy_network_processing_fee: '0.00001226',
    },
    {
      currency: 'USDT',
      buy_rate: '0.9342',
      buy_network_processing_fee: '2.788176',
    },
    {
      currency: 'USDT_TRC20',
      buy_rate: '0.9342',
      buy_network_processing_fee: '3.654064',
    },
    {
      currency: 'USDT_POLYGON',
      buy_rate: '0.9342',
      buy_network_processing_fee: '0.130011',
    },
    {
      currency: 'USDC',
      buy_rate: '0.9347',
      buy_network_processing_fee: '2.811341',
    },
    {
      currency: 'USDC_POLYGON',
      buy_rate: '0.9347',
      buy_network_processing_fee: '0.130157',
    },
    {
      currency: 'USDCE_POLYGON',
      buy_rate: '0.9347',
      buy_network_processing_fee: '0.130139',
    },
    {
      currency: 'DASH',
      buy_rate: '22.4524',
      buy_network_processing_fee: '0.00004226',
    },
    {
      currency: 'XRP',
      buy_rate: '0.4448',
      buy_network_processing_fee: '0.001012',
    },
    {
      currency: 'TRX',
      buy_rate: '0.1136',
      buy_network_processing_fee: '1.300000',
    },
    {
      currency: 'MATIC',
      buy_rate: '0.5393',
      buy_network_processing_fee: '0.050655',
    },
  ];

  const tempData = data.map((item) => {
    return { label: item.currency, value: item.buy_rate, fee: item.buy_network_processing_fee };
  });

  const tempPaymentData = {
    amount: 20,
    qux_charge: 0.6,
    total_amount: 20.6,
    amount_exchange: '0.00034201',
    network_processing_fee: '0.00001589',
    rate: '60230.3954',
    payment_id: '78656217-7199-4b6a-b657-7c281896ecea',
    address: 'btc-ba96a2b8113747aa800fdb609674376f',
    qr_img:
      'https://api.forumpay.com/pay/qr/?d=https%3A%2F%2Fsandbox.dashboard.forumpay.com%2Fpay%2FsandboxWallet.transfer%3Fcurrency%3DBTC%26address%3Dbtc-ba96a2b8113747aa800fdb609674376f%26amount%3D0.0003579',
    currency: 'BTC',
    pos_id: 'QUXPAY-PURCHASE_10',
    fast_transaction_fee: '0.00023915',
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(tempPaymentData.address);
      // setMessage('Text copied to clipboard!');
      notify('Text copied to clipboard!', { status: 'info' });
    } catch (err) {
      notify('Failed to copy text', { status: 'info' });
    }
  };

  return (
    <>
      <Controller
        control={control}
        name="currency"
        rules={{ required: 'Bank Name is required' }}
        render={({ field: { onChange, onBlur }, fieldState: { error } }): ReactElement => {
          return (
            <FormContainer label="Select Bank Name" errorMessage={error?.message ?? ''}>
              <Select
                onBlur={onBlur}
                styles={reactSelectStyles}
                placeholder="Select Crypto Type"
                // isLoading={isLoading}
                options={tempData}
                onChange={(e: SingleValue<ValueLabelProps>): void => {
                  onChange(e?.label);
                }}
                // onInputChange={(e: string): void => setSearchText(e)}
                isClearable={true}
              />
            </FormContainer>
          );
        }}
      />

      {watch('currency') && (
        <Box mb="2rem">
          <Box color="white">
            <Text fontSize="24px">Current Exchange Value</Text>
            <Text fontSize="24px">$67,624.54</Text>
          </Box>
          <Box textAlign="start" mt="2rem">
            <Text fontSize="18px" color="white">
              Send .065475 Bitcoin To This <br /> Temporary Wallet
            </Text>
          </Box>
          <Flex gap={4} alignItems="center" mt="0.5rem">
            <Text textAlign="start">{tempPaymentData.address}</Text>
            <Box cursor="pointer" onClick={copyToClipboard}>
              <Image src={ClipboardIcon} height={30} width={32} alt="Clipboard" />
            </Box>
          </Flex>

          <Flex justifyContent="center" mt="2rem">
            <Image src={`${tempPaymentData.qr_img}`} height={250} width={250} alt="QR Code" />
          </Flex>
        </Box>
      )}
    </>
  );
};

export default CashInCrypto;
