type Props = {
  title: string;
  context: string;
  imageSrc: string;
  reverse: boolean;
  alignItems?: 'flex-end' | 'center' | 'flex-start';
};

export const MILITARY_GRADE_SECURITY_MOCK: Props[] = [
  {
    title: 'Backed by Bank-Level Protocols',
    context: `Multilayered security protections follow the strictest 
      protocols used by financial institutions worldwide. 
      Fort Knox level.`,
    imageSrc: '/assets/images/military-grade-security-1.png',
    reverse: false,
  },
  {
    title: 'Patent-Pending Encryption Mesh',
    context: `QuxPay utilizes a global encryption mesh 
      infrastructure allowing each device to pay 
      in real-time. Big words but the point is - 
      there's no central point of failure. Hacks 
      and data breaches can't happen.`,
    imageSrc: '/assets/images/military-grade-security-2.png',
    reverse: true,
  },
  {
    title: 'Anonymous Transactions',
    context: `Every payment is anonymized using industry
      leading tools. Your identity stays hidden, even
      from us. Totally private.`,
    imageSrc: '/assets/images/military-grade-security-3.png',
    reverse: true,
  },
];

export const NO_MIDDLEMAN_MOCKS: Props[] = [
  {
    title: 'Crystal Clear Fees',
    context: `The price you see is the price you pay. 
    No surprise charges popping up later.`,
    imageSrc: '/assets/images/no-middleman-1.png',
    reverse: true,
    alignItems: 'flex-end',
  },
  {
    title: 'User Data is Sacred',
    context: `We're not like your regular apps, we don't sell 
    or allow outside companies access to our systems 
    or user data for any reason. `,
    imageSrc: '/assets/images/no-middleman-2.png',
    reverse: true,
  },
  {
    title: 'Compliance Assured',
    context: `We abide by strict data and privacy laws.You're protected.`,
    imageSrc: '/assets/images/no-middleman-3.png',
    reverse: true,
  },
];

export const PAYMENTS_MADE_PERFECT_MOCKS: Props[] = [
  {
    title: 'Transfer Limits? What is that?',
    context: `Send as much as you want. No annoying 
    restrictions on payment amounts. 
    Total freedom.`,
    imageSrc: '/assets/images/payments-made-perfect-1.png',
    reverse: true,
  },
  {
    title: 'Zero Fees. Ever.',
    context: `Forget fees eating into transfers. 
    QuxPay is absolutely free for P2P payments. 
    Keep more in your wallet.`,
    imageSrc: '/assets/images/payments-made-perfect-2.png',
    reverse: true,
  },
];

export const TRANSFERS_MOCKS: Props[] = [
  {
    title: 'No Clearing Delays',
    context: `Unlike cryptos and banks, once your money 
    is converted into QUX Tokens, there are no 
    multi-day waits for transfers to finalize. 
    Payments are instantly accessible.`,
    imageSrc: '/assets/images/transfers-1.png',
    reverse: true,
  },
  {
    title: 'Recipient Notifications',
    context: `We instantly notify recipients via push 
    notification when funds are received in 
    their account within milliseconds.`,
    imageSrc: '/assets/images/transfers-2.png',
    reverse: true,
  },
];
