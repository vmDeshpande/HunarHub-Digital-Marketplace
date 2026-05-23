import { create } from "zustand";
import { persist } from "zustand/middleware";

const isValidCartProductId = (id: unknown): id is string =>
  typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  customization?: string;
  entrepreneur: {
    id: string;
    businessName: string;
  };
  maxQuantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const itemToAdd = {
          ...item,
          productId: String(item.productId),
          quantity: item.quantity || 1,
        };

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === itemToAdd.productId && i.variant === itemToAdd.variant
          );

          if (existingIndex > -1) {
            // Update quantity of existing item
            const newItems = [...state.items];
            const newQuantity = Math.min(
              newItems[existingIndex].quantity + itemToAdd.quantity,
              newItems[existingIndex].maxQuantity
            );
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newQuantity,
            };
            return { items: newItems };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              itemToAdd,
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },
    }),
    {
      name: "hunarhub-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
