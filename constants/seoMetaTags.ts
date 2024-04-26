import { Pages } from 'typings';

type SeoMetaTags = {
  [key in Pages]?: {
    title: string;
    description: string;
    keyphrase: string;
    image: string;
  };
};

const image: { image: string } = {
  image: ``,
};

export const SEO_META_TAGS: SeoMetaTags = {
  index: {
    title: `Secure, Private Mobile Payments | QuxPay`,
    description:
      'Send money to friends and businesses instantly and privately using the secure QuxPay mobile app. No hidden fees or data sharing.',
    keyphrase: 'Secure mobile payments',
    ...image,
  },
  'military-grade-security': {
    title: `Private Payment App | QuxPay`,
    description:
      'Send money privately from your phone using QuxPay. No data tracking, no hacks. Just safe, fast payments between friends and businesses.',
    keyphrase: 'Private payment app',
    ...image,
  },
  'no-middleman': {
    title: `Direct Transfers, No Middleman | QuxPay`,
    description:
      'QuxPay allows direct token transfers with no middleman. No confusing crypto, just instant peer-to-peer cash transfers with transparent fees and secure data.',
    keyphrase: 'no middleman payment transfer app',
    ...image,
  },
  'payments-made-perfect': {
    title: `Free Peer-to-Peer Payments, No Limits | QuxPay`,
    description:
      'QuxPay is a free peer-to-peer payment app with no hidden fees and unlimited transfer amounts. Send money instantly to friends and family, no waiting.',
    keyphrase: 'free peer-to-peer payment app',
    ...image,
  },
  transfers: {
    title: `Instant Payment Transfers, No Delays | QuxPay`,
    description: 'QuxPay lets you transfers in an instant with no delays. Get notified immediately when paid.',
    keyphrase: 'instant transfers payment app',
    ...image,
  },
  faqs: {
    title: `Your Questions Answered | QuxPay FAQ`,
    description: 'Get quick answers to common questions about using QuxPay- sending, receiving, security, and more.',
    keyphrase: 'quxpay faq',
    ...image,
  },
};
