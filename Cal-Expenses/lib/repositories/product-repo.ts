import { getStorage, StorageKeys } from "../storage/storage-provider";
import { Product } from "../domain";
import { seedProducts } from "../seed/products";

export const ProductRepository = {
  getAll(): Product[] {
    const storage = getStorage();
    let products = storage.get<Product[]>(StorageKeys.products);
    if (!products || products.length === 0) {
      products = seedProducts;
      storage.set(StorageKeys.products, products);
    }
    return products;
  },

  getById(id: string): Product | null {
    return this.getAll().find((p) => p.id === id) ?? null;
  },

  getBySlug(slug: string): Product | null {
    return this.getAll().find((p) => p.slug === slug) ?? null;
  },

  getPublished(): Product[] {
    return this.getAll().filter((p) => p.status === "published");
  },

  getByCollection(productIds: string[]): Product[] {
    const map = new Map(this.getAll().map((p) => [p.id, p]));
    return productIds.map((id) => map.get(id)).filter(Boolean) as Product[];
  },

  create(product: Product): Product {
    const storage = getStorage();
    const all = this.getAll();
    if (all.some((p) => p.slug === product.slug)) {
      throw new Error("Slug must be unique");
    }
    const next = [...all, product];
    storage.set(StorageKeys.products, next);
    return product;
  },

  update(id: string, patch: Partial<Product>): Product {
    const storage = getStorage();
    const all = this.getAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    if (patch.slug && all.some((p) => p.slug === patch.slug && p.id !== id)) {
      throw new Error("Slug must be unique");
    }
    const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() } as Product;
    all[idx] = updated;
    storage.set(StorageKeys.products, all);
    return updated;
  },

  delete(id: string): void {
    const storage = getStorage();
    const all = this.getAll();
    // Soft archive check: if referenced in orders, prefer soft behavior via caller
    const filtered = all.filter((p) => p.id !== id);
    storage.set(StorageKeys.products, filtered);
  },

  search(query: string): Product[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.getPublished().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fragranceFamily.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        p.notes.some((n) => n.noteName.toLowerCase().includes(q))
    );
  },

  filter(opts: {
    gender?: string;
    family?: string;
    priceMin?: number;
    priceMax?: number;
    occasion?: string;
    season?: string;
    inStockOnly?: boolean;
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
  }): Product[] {
    let res = this.getPublished();
    if (opts.gender) res = res.filter((p) => p.gender === opts.gender);
    if (opts.family) res = res.filter((p) => p.fragranceFamily === opts.family);
    if (opts.priceMin !== undefined) res = res.filter((p) => p.price >= opts.priceMin!);
    if (opts.priceMax !== undefined) res = res.filter((p) => p.price <= opts.priceMax!);
    if (opts.occasion) res = res.filter((p) => p.occasion.includes(opts.occasion!));
    if (opts.season) res = res.filter((p) => p.season.includes(opts.season!));
    if (opts.inStockOnly) res = res.filter((p) => p.totalStock > 0);

    if (opts.sort === "price_asc") res = [...res].sort((a, b) => a.price - b.price);
    if (opts.sort === "price_desc") res = [...res].sort((a, b) => b.price - a.price);
    if (opts.sort === "newest") res = [...res].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (opts.sort === "popular") res = [...res].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));

    return res;
  },
};
