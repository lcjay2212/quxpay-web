import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  productValue?:
    | {
        sku: string;
        quantity: number;
      }[]
    | null;
  setProductValue: (
    productValue:
      | [
          {
            sku: string;
            quantity: number;
          }
        ]
      | null
  ) => void;
  price?: number | null;
  setPrice: (price: number) => void;
};
export const useProductModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  productValue: null,
  setProductValue: (productValue): void =>
    set(() => ({
      productValue,
    })),
  price: null,
  setPrice: (price): void =>
    set(() => ({
      price,
    })),
}));
