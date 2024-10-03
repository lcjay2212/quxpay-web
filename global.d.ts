/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      token: string;
    };
  }
}
interface PosHistoryProps {
  id: string;
  amount: number;
  po_from: string;
  po_to: string;
  paid_po_from: boolean;
  paid_po_to: boolean;
  completed: boolean | null;
  received: string;
  sent: string;
  created: string;
  token_fee: number;
  total_amount: number;
  qr_image: string;
  qr_id: string;
  selected_products: Array<{
    id: number;
    product: string;
    variation: string;
    product_image: string;
  }>;
  product_po: boolean;
  token_po: boolean;
  transaction_upload: boolean;
  csv_upload_date: Date | string | null; // Assume it's a date, or adjust if otherwise
  bank_name: string | null;
  account_number: string | number | null; // Changed to string for potential leading zeros
  show_token_fee: boolean;
  type: string;
  label: string;
}

interface Details {
  masterPublicKey: string;
  encryptedMainKey: string | null;
  decryptedMainKey: string | null;
  iv: string;
  key: string;
  userPublicKeyPem?: string;
  details: {
    master_public_key: string;
    core: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes: any;
    signature: string;
  };
}
