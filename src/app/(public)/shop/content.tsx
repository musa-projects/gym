"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Tag,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                 Mock Data                                  */
/* -------------------------------------------------------------------------- */

interface Product {
  id: string;
  name: string;
  slug: string;
  category: "apparel" | "supplements" | "accessories" | "equipment";
  price: number; // cents
  salePrice: number | null; // cents
  image: string;
  isFeatured: boolean;
  stockQty: number;
  tags: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Performance T-Shirt (Black)",
    slug: "performance-t-shirt-black",
    category: "apparel",
    price: 3499,
    salePrice: null,
    image: "/images/shop/product-1.jpg",
    isFeatured: true,
    stockQty: 45,
    tags: ["bestseller", "new-arrival"],
  },
  {
    id: "prod_002",
    name: "Training Shorts",
    slug: "training-shorts",
    category: "apparel",
    price: 4499,
    salePrice: null,
    image: "/images/shop/product-2.jpg",
    isFeatured: false,
    stockQty: 30,
    tags: ["lightweight"],
  },
  {
    id: "prod_003",
    name: "Gym Hoodie",
    slug: "gym-hoodie",
    category: "apparel",
    price: 6499,
    salePrice: 5499,
    image: "/images/shop/product-3.jpg",
    isFeatured: true,
    stockQty: 20,
    tags: ["winter", "popular"],
  },
  {
    id: "prod_004",
    name: "Compression Leggings",
    slug: "compression-leggings",
    category: "apparel",
    price: 4999,
    salePrice: null,
    image: "/images/shop/product-4.jpg",
    isFeatured: false,
    stockQty: 25,
    tags: ["performance"],
  },
  {
    id: "prod_005",
    name: "Whey Protein (Chocolate)",
    slug: "whey-protein-chocolate",
    category: "supplements",
    price: 5499,
    salePrice: null,
    image: "/images/shop/product-5.jpg",
    isFeatured: true,
    stockQty: 60,
    tags: ["bestseller", "protein"],
  },
  {
    id: "prod_006",
    name: "Pre-Workout Formula",
    slug: "pre-workout-formula",
    category: "supplements",
    price: 3999,
    salePrice: null,
    image: "/images/shop/product-6.jpg",
    isFeatured: false,
    stockQty: 40,
    tags: ["energy", "focus"],
  },
  {
    id: "prod_007",
    name: "BCAA Recovery Mix",
    slug: "bcaa-recovery-mix",
    category: "supplements",
    price: 2999,
    salePrice: 2499,
    image: "/images/shop/product-7.jpg",
    isFeatured: false,
    stockQty: 35,
    tags: ["recovery", "amino-acids"],
  },
  {
    id: "prod_008",
    name: "Creatine Monohydrate",
    slug: "creatine-monohydrate",
    category: "supplements",
    price: 2499,
    salePrice: null,
    image: "/images/shop/product-8.jpg",
    isFeatured: false,
    stockQty: 50,
    tags: ["strength", "staple"],
  },
  {
    id: "prod_009",
    name: "Gym Bag (Pro)",
    slug: "gym-bag-pro",
    category: "accessories",
    price: 7999,
    salePrice: null,
    image: "/images/shop/product-9.jpg",
    isFeatured: true,
    stockQty: 15,
    tags: ["premium", "durable"],
  },
  {
    id: "prod_010",
    name: "Shaker Bottle",
    slug: "shaker-bottle",
    category: "accessories",
    price: 1499,
    salePrice: null,
    image: "/images/shop/product-10.jpg",
    isFeatured: false,
    stockQty: 100,
    tags: ["essential"],
  },
  {
    id: "prod_011",
    name: "Resistance Bands Set",
    slug: "resistance-bands-set",
    category: "equipment",
    price: 3499,
    salePrice: null,
    image: "/images/shop/product-11.jpg",
    isFeatured: false,
    stockQty: 40,
    tags: ["home-workout", "versatile"],
  },
  {
    id: "prod_012",
    name: "Lifting Gloves",
    slug: "lifting-gloves",
    category: "accessories",
    price: 2499,
    salePrice: 1999,
    image: "/images/shop/product-12.jpg",
    isFeatured: false,
    stockQty: 55,
    tags: ["grip", "protection"],
  },
];

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Apparel", value: "apparel" },
  { label: "Supplements", value: "supplements" },
  { label: "Accessories", value: "accessories" },
  { label: "Equipment", value: "equipment" },
] as const;

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getEffectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export function ShopContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());

  /* ---- Filter & sort ---- */
  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "all"
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "featured":
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case "price-asc":
        result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "newest":
        // Mock: reverse original order to simulate newest first
        result.reverse();
        break;
    }

    return result;
  }, [activeCategory, sortBy]);

  /* ---- Add to cart handler ---- */
  function handleAddToCart(product: Product) {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="Shop"
        title="Official Big Vision Gear"
        description="Premium merchandise, supplements, and accessories to fuel your training and represent the Big Vision lifestyle."
      />

      {/* Filters & Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---- Toolbar: Categories + Sort ---- */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                    activeCategory === cat.value
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-card text-muted-foreground border border-border hover:text-foreground hover:border-foreground/20"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <label htmlFor="sort-select" className="sr-only">
                Sort by
              </label>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none -ml-7 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* ---- Results count ---- */}
          <p className="mb-6 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {/* ---- Product Grid ---- */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/20">
                  {/* Image placeholder */}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="relative flex h-64 items-center justify-center bg-muted"
                  >
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/40 transition-transform duration-300 group-hover:scale-110" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.salePrice !== null && (
                        <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                          Sale
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                          Featured
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Category */}
                    <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                      {product.category}
                    </span>

                    {/* Name */}
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mt-2 flex items-center gap-2">
                      {product.salePrice !== null ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.salePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Add to cart */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="font-[var(--font-oswald)] text-2xl font-bold uppercase text-foreground">
                No Products Found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---- Floating Cart Indicator ---- */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <Link
              href="/shop/cart"
              className={cn(
                "flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-2xl shadow-primary/30 transition-transform hover:scale-105"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">View Cart</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {itemCount}
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
