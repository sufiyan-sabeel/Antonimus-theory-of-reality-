/**
 * Domain models as per PUREFOME_PRD §27
 * Strict typing, no any
 */

export type ProductStatus = "draft" | "published";
export type Gender = "unisex" | "men" | "women";
export type FragranceFamily =
  | "woody"
  | "oriental"
  | "fresh"
  | "floral"
  | " Gourmand"
  | "oud"
  | "citrus"
  | "amber"
  | "spicy"
  | "aquatic";
export type NoteStage = "top" | "heart" | "base";

export interface ProductVariant {
  id: string;
  productId: string;
  size: string; // e.g., "50ml", "100ml"
  price: number; // override price, or product base price if null
  sku: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  type: "hero" | "gallery" | "lifestyle" | "packaging";
  sortOrder: number;
}

export interface FragranceNote {
  id: string;
  productId: string;
  stage: NoteStage;
  noteName: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  gender: Gender;
  fragranceFamily: string;
  intensity: "light" | "moderate" | "strong" | "intense";
  longevity: string; // e.g., "6-8h"
  sillage: string; // e.g., "moderate"
  occasion: string[];
  season: string[];
  tags: string[];
  status: ProductStatus;
  isBestseller: boolean;
  isNew: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  images: ProductImage[];
  notes: FragranceNote[];
  // inventory derived
  totalStock: number;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  visibility: "visible" | "hidden";
  seoTitle: string;
  seoDescription: string;
  accentColor?: string;
  productIds: string[];
}

export interface InventoryLog {
  id: string;
  variantId: string;
  change: number;
  reason: string;
  adminUserId: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: "home" | "work" | "other";
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "pending"
  | "awaiting_verification"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refund_requested"
  | "refunded";

export type PaymentStatus =
  | "awaiting_verification"
  | "paid"
  | "rejected"
  | "failed"
  | "pending"
  | "cod_pending";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productNameSnapshot: string;
  variantLabel: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string; // for guest
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  items: OrderItem[];
  paymentMethodId: string | null;
  paymentProofId: string | null;
  transactionRefId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethodType = "gateway" | "cod" | "manual_upi";

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  type: PaymentMethodType;
  upiId: string | null;
  qrImageUrl: string | null;
  instructions: string | null;
  accountHolderName: string | null;
  phone: string | null;
  minOrderAmount: number | null;
  maxOrderAmount: number | null;
  enabled: boolean;
  sortOrder: number;
}

export interface PaymentProof {
  id: string;
  orderId: string;
  paymentMethodId: string;
  imageUrl: string; // data URL for local demo (in prod: access-controlled storage)
  transactionRefId: string;
  submittedAt: string;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  decision: "approved" | "rejected" | "request_new_proof" | null;
  rejectReason: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minCartValue: number | null;
  scope: "global" | "product" | "collection";
  scopeIds: string[]; // productIds or collectionIds if scoped
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  perUserLimit: number | null;
  usedCount: number;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  verifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string; // not real hash in local mode, just marker
  createdAt: string;
  status: "active" | "blocked";
  role: "customer" | "admin";
}

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "CONTENT_MANAGER"
  | "ORDER_MANAGER";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "blocked";
  lastLoginAt: string | null;
}

export interface HomepageSection {
  id: string;
  type: "hero" | "banner" | "featured_collection" | "editorial" | "testimonial" | "newsletter" | "announcement";
  title: string;
  description: string;
  mediaUrl: string;
  ctaLabel: string;
  ctaLink: string;
  enabled: boolean;
  sortOrder: number;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  freeShippingThreshold: number;
  shippingFlatRate: number;
  lowStockThreshold: number;
  codEnabled: boolean;
  codMinOrder: number | null;
  codMaxOrder: number | null;
  announcementEnabled: boolean;
  announcementText: string;
}

// Helper: generate IDs
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function generateOrderNumber(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PF-${y}${m}-${r}`;
}
