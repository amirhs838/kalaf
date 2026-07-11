"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, options: string | null) => void;
  updateQuantity: (productId: string, options: string | null, qty: number) => void;
  clear: () => void;
  setItems: (items: CartItem[]) => void;
}

const sameLine = (a: CartItem, productId: string, options: string | null) =>
  a.productId === productId && (a.options ?? null) === (options ?? null);

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.productId, item.options));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.options)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, options) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, options)),
        })),
      updateQuantity: (productId, options, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, productId, options) ? { ...i, quantity: Math.max(1, qty) } : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    { name: "kolaf-kaghaz-cart" }
  )
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.quantity, 0);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
