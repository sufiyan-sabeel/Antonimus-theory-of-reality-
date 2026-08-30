import { getStorage, StorageKeys } from "../storage/storage-provider";
import { Cart, CartItem, generateId } from "../domain";

function getOrCreateCart(): Cart {
  const storage = getStorage();
  let cart = storage.get<Cart>(StorageKeys.cart);
  if (!cart) {
    cart = {
      id: generateId(),
      userId: null,
      sessionId: generateId(),
      items: [],
      updatedAt: new Date().toISOString(),
    };
    storage.set(StorageKeys.cart, cart);
  }
  return cart;
}

export const CartRepository = {
  get(): Cart {
    return getOrCreateCart();
  },

  addItem(variantId: string, productId: string, price: number, qty = 1): Cart {
    const cart = getOrCreateCart();
    const existing = cart.items.find((i) => i.variantId === variantId);
    if (existing) {
      existing.quantity += qty;
    } else {
      const item: CartItem = {
        id: generateId(),
        variantId,
        productId,
        quantity: qty,
        priceAtAdd: price,
      };
      cart.items.push(item);
    }
    cart.updatedAt = new Date().toISOString();
    getStorage().set(StorageKeys.cart, cart);
    return cart;
  },

  updateQty(itemId: string, qty: number): Cart {
    const cart = getOrCreateCart();
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Cart item not found");
    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = qty;
    }
    cart.updatedAt = new Date().toISOString();
    getStorage().set(StorageKeys.cart, cart);
    return cart;
  },

  removeItem(itemId: string): Cart {
    const cart = getOrCreateCart();
    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.updatedAt = new Date().toISOString();
    getStorage().set(StorageKeys.cart, cart);
    return cart;
  },

  clear(): Cart {
    const cart = getOrCreateCart();
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    getStorage().set(StorageKeys.cart, cart);
    return cart;
  },

  count(): number {
    return getOrCreateCart().items.reduce((s, i) => s + i.quantity, 0);
  },

  subtotal(): number {
    return getOrCreateCart().items.reduce((s, i) => s + i.priceAtAdd * i.quantity, 0);
  },

  mergeUserId(userId: string): void {
    const cart = getOrCreateCart();
    cart.userId = userId;
    getStorage().set(StorageKeys.cart, cart);
  },
};
