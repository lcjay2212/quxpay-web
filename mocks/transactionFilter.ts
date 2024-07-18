import { FailedIcon, ProcessingIcon, SuccessIcon } from 'public/assets';

export const DATE_FILTER = [
  {
    value: 'last_7_days',
    label: 'Last 7 days',
  },
  {
    value: 'last_30_days',
    label: 'Last 30 days',
  },
  {
    value: 'last_3_months',
    label: 'Last 3 months',
  },
  {
    value: 'last_6_months',
    label: 'Last 6 months',
  },
];

export const TRANSACTION_FILTER = [
  {
    value: 'purchase',
    label: 'Purchase',
  },
  {
    value: 'redeem_tokens',
    label: 'Redeem Tokens',
  },
  {
    value: 'send_tokens',
    label: 'Send QUX® Tokens',
  },
  {
    value: 'token_history',
    label: 'Token History',
  },
  {
    value: 'services',
    label: 'Services',
  },
  {
    value: 'pos',
    label: 'POs',
  },
];

export const STATUS_FILTER = [
  {
    icon: SuccessIcon,
    value: 'success',
    label: 'Successful',
  },
  {
    icon: FailedIcon,
    value: 'failed',
    label: 'Failed',
  },
  {
    icon: ProcessingIcon,
    value: 'processing',
    label: 'Processing',
  },
];
