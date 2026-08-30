import { getStorage, StorageKeys } from "../storage/storage-provider";
import { Order } from "../domain";

export const OrderRepository = {
  getAll(): Order[] {
    return getStorage().get<Order[]>(StorageKeys.orders) ?? [];
  },

  getById(id: string): Order | null {
    return this.getAll().find((o) => o.id === id) ?? null;
  },

  getByUser(userId: string): Order[] {
    return this.getAll().filter((o) => o.userId === userId);
  },

  getByEmail(email: string): Order[] {
    return this.getAll().filter((o) => o.email === email);
  },

  create(order: Order): Order {
    const storage = getStorage();
    const all = this.getAll();
    // idempotency: prevent duplicate orderNumber
    if (all.some((o) => o.orderNumber === order.orderNumber)) {
      throw new Error("Duplicate order number");
    }
    const next = [...all, order];
    storage.set(StorageKeys.orders, next);
    return order;
  },

  update(id: string, patch: Partial<Order>): Order {
    const storage = getStorage();
    const all = this.getAll();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() } as Order;
    all[idx] = updated;
    storage.set(StorageKeys.orders, all);
    return updated;
  },

  // For admin verification queue
  getAwaitingVerification(): Order[] {
    return this.getAll().filter((o) => o.paymentStatus === "awaiting_verification");
  },
};
