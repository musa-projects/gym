"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Package,
  ShoppingBag,
  AlertTriangle,
  Archive,
  Pencil,
  Trash2,
  X,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductCategory = "apparel" | "supplements" | "accessories" | "equipment";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  salePrice: number | null;
  stock: number;
  description: string;
  active: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Performance T-Shirt (Black)",
    slug: "performance-t-shirt-black",
    category: "apparel",
    price: 34.99,
    salePrice: null,
    stock: 45,
    description: "Moisture-wicking performance tee in classic black. Ideal for intense training sessions.",
    active: true,
  },
  {
    id: "prod_2",
    name: "Gym Hoodie",
    slug: "gym-hoodie",
    category: "apparel",
    price: 64.99,
    salePrice: 54.99,
    stock: 22,
    description: "Premium heavyweight hoodie with embroidered logo. Perfect for warm-ups and cool-downs.",
    active: true,
  },
  {
    id: "prod_3",
    name: "Whey Protein (Chocolate)",
    slug: "whey-protein-chocolate",
    category: "supplements",
    price: 54.99,
    salePrice: null,
    stock: 38,
    description: "25g protein per serving. Rich chocolate flavor with fast absorption whey isolate blend.",
    active: true,
  },
  {
    id: "prod_4",
    name: "Pre-Workout Formula",
    slug: "pre-workout-formula",
    category: "supplements",
    price: 39.99,
    salePrice: null,
    stock: 0,
    description: "High-stim pre-workout with beta-alanine, citrulline, and caffeine for peak performance.",
    active: true,
  },
  {
    id: "prod_5",
    name: "Gym Bag (Pro)",
    slug: "gym-bag-pro",
    category: "accessories",
    price: 79.99,
    salePrice: null,
    stock: 15,
    description: "Spacious 45L duffel with shoe compartment, ventilated mesh, and waterproof base.",
    active: true,
  },
  {
    id: "prod_6",
    name: "Shaker Bottle",
    slug: "shaker-bottle",
    category: "accessories",
    price: 14.99,
    salePrice: null,
    stock: 120,
    description: "BPA-free 700ml shaker with mixing ball and secure screw-top lid.",
    active: true,
  },
  {
    id: "prod_7",
    name: "Resistance Bands Set",
    slug: "resistance-bands-set",
    category: "equipment",
    price: 34.99,
    salePrice: null,
    stock: 8,
    description: "Set of 5 loop bands with varying resistance levels. Includes carry bag.",
    active: true,
  },
  {
    id: "prod_8",
    name: "Old Logo Tee",
    slug: "old-logo-tee",
    category: "apparel",
    price: 19.99,
    salePrice: null,
    stock: 3,
    description: "Legacy design t-shirt. Limited remaining stock, not available for new orders.",
    active: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "supplements", label: "Supplements" },
  { value: "accessories", label: "Accessories" },
  { value: "equipment", label: "Equipment" },
];

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stockColor(stock: number) {
  if (stock === 0) return "text-red-400";
  if (stock < 10) return "text-yellow-400";
  return "text-emerald-400";
}

function stockBg(stock: number) {
  if (stock === 0) return "bg-red-500/10";
  if (stock < 10) return "bg-yellow-500/10";
  return "bg-emerald-500/10";
}

// ─── Empty Form State ────────────────────────────────────────────────────────

interface ProductForm {
  name: string;
  slug: string;
  category: ProductCategory;
  price: string;
  salePrice: string;
  stock: string;
  description: string;
  active: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  category: "apparel",
  price: "",
  salePrice: "",
  stock: "",
  description: "",
  active: true,
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ShopAdminPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  // ── Derived stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.active).length;
    const outOfStock = products.filter((p) => p.stock === 0 && p.active).length;
    const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
    return { total, active, outOfStock, totalInventory };
  }, [products]);

  // ── Filtered products ──────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (statusFilter === "active" && !p.active) return false;
      if (statusFilter === "inactive" && p.active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !p.slug.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [products, categoryFilter, statusFilter, search]);

  // ── Modal handlers ─────────────────────────────────────────────────────
  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      stock: product.stock.toString(),
      description: product.description,
      active: product.active,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required.");
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                slug: form.slug || slugify(form.name),
                category: form.category,
                price: parseFloat(form.price),
                salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
                stock: parseInt(form.stock) || 0,
                description: form.description,
                active: form.active,
              }
            : p
        )
      );
      toast.success(`"${form.name}" updated successfully.`);
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        stock: parseInt(form.stock) || 0,
        description: form.description,
        active: form.active,
      };
      setProducts((prev) => [...prev, newProduct]);
      toast.success(`"${form.name}" added successfully.`);
    }

    setModalOpen(false);
  }

  function handleDelete(product: Product) {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success(`"${product.name}" deleted.`);
  }

  // ── KPI cards ──────────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Total Products",
      value: stats.total,
      icon: Package,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active Products",
      value: stats.active,
      icon: ShoppingBag,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
    {
      label: "Total Inventory",
      value: `${stats.totalInventory} units`,
      icon: Archive,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your merchandise shop inventory
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", kpi.iconBg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Filters Bar ──────────────────────────────────────────────────── */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                  categoryFilter === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer",
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Products Table (Desktop) ─────────────────────────────────────── */}
      <Card className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => openEditModal(product)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold capitalize text-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {product.salePrice ? (
                      <div>
                        <span className="text-sm font-bold text-primary">
                          {formatUSD(product.salePrice)}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          {formatUSD(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-foreground">
                        {formatUSD(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        stockBg(product.stock),
                        stockColor(product.stock)
                      )}
                    >
                      {product.stock === 0 ? "Out of stock" : product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        product.active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-neutral-500/10 text-neutral-400"
                      )}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(product);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">No products found</p>
                    <p className="text-xs text-muted-foreground/60">
                      Try adjusting your filters or search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Products Cards (Mobile) ──────────────────────────────────────── */}
      <div className="space-y-3 lg:hidden">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="p-4 transition-colors hover:border-primary/30 cursor-pointer"
            onClick={() => openEditModal(product)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  product.active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-neutral-500/10 text-neutral-400"
                )}
              >
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-sm font-bold text-primary">
                      {formatUSD(product.salePrice)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatUSD(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-foreground">
                    {formatUSD(product.price)}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  stockBg(product.stock),
                  stockColor(product.stock)
                )}
              >
                {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(product);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </Card>
        ))}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
            <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-tight text-foreground">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })
                  }
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Product name"
                />
              </div>

              {/* Slug (auto-generated) */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-muted-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="auto-generated-slug"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as ProductCategory })
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="apparel">Apparel</option>
                  <option value="supplements">Supplements</option>
                  <option value="accessories">Accessories</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Product description..."
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <span className="text-sm font-medium text-foreground">Active</span>
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                    form.active ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                      form.active ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                {editingId ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
