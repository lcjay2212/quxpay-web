// SEO meta tags for each page. Add or update as needed.
// The 'image' field uses a default if not specified.
import { Pages } from 'typings';

const DEFAULT_IMAGE = '/assets/icons/quxpay-logo.png';

type SeoMetaTags = {
  [key in Pages]?: {
    title: string;
    description: string;
    keyphrase: string;
    image: string;
  };
};

export const SEO_META_TAGS: SeoMetaTags = {
  index: {
    title: `Secure, Private Mobile Payments | QUX Pay®`,
    description:
      'Send money to friends and businesses instantly and privately using the secure QUX Pay® mobile app. No hidden fees or data sharing.',
    keyphrase: 'Secure mobile payments',
    image: DEFAULT_IMAGE,
  },
  'military-grade-security': {
    title: `Private Payment App | QUX Pay®`,
    description:
      'Send money privately from your phone using QUX Pay®. No data tracking, no hacks. Just safe, fast payments between friends and businesses.',
    keyphrase: 'Private payment app',
    image: DEFAULT_IMAGE,
  },
  'no-middleman': {
    title: `Direct Transfers, No Middleman | QUX Pay®`,
    description:
      'QUX Pay® allows direct token transfers with no middleman. No confusing crypto, just instant peer-to-peer cash transfers with transparent fees and secure data.',
    keyphrase: 'no middleman payment transfer app',
    image: DEFAULT_IMAGE,
  },
  'payments-made-perfect': {
    title: `Free Peer-to-Peer Payments, No Limits | QUX Pay®`,
    description:
      'QUX Pay® is a free peer-to-peer payment app with no hidden fees and unlimited transfer amounts. Send money instantly to friends and family, no waiting.',
    keyphrase: 'free peer-to-peer payment app',
    image: DEFAULT_IMAGE,
  },
  transfers: {
    title: `Instant Payment Transfers, No Delays | QUX Pay®`,
    description: 'QUX Pay® lets you transfers in an instant with no delays. Get notified immediately when paid.',
    keyphrase: 'instant transfers payment app',
    image: DEFAULT_IMAGE,
  },
  faqs: {
    title: `Your Questions Answered | QUX Pay® FAQ`,
    description: 'Get quick answers to common questions about using QUX Pay®- sending, receiving, security, and more.',
    keyphrase: 'QUX Pay® faq',
    image: DEFAULT_IMAGE,
  },
  dashboard: {
    title: `Dashboard`,
    description: '',
    keyphrase: 'QUX Pay® Dashboard',
    image: DEFAULT_IMAGE,
  },
};
