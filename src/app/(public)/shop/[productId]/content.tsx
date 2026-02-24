"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  Package,
  Ruler,
  Truck,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
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
  description: string;
  hasSize: boolean;
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
    description:
      "Engineered for peak performance, this moisture-wicking t-shirt keeps you cool and dry during the most intense workouts. Made from a premium blend of polyester and elastane for a comfortable, athletic fit that moves with you. Features the iconic Big Vision logo embroidered on the chest.",
    hasSize: true,
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
    description:
      "Lightweight and breathable training shorts designed for unrestricted movement. Built with a 4-way stretch fabric and an internal drawstring waistband for a secure, adjustable fit. Dual side pockets keep your essentials close.",
    hasSize: true,
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
    description:
      "Stay warm before and after your sessions with this heavyweight cotton-blend hoodie. Featuring a relaxed, oversized fit with ribbed cuffs and hem, a kangaroo pocket, and the Big Vision wordmark across the back. Perfect for layering on cold mornings.",
    hasSize: true,
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
    description:
      "High-performance compression leggings that support your muscles and improve blood flow during training. Constructed with flatlock seams to prevent chafing and a high-rise waistband for secure coverage. Squat-proof and available in multiple sizes.",
    hasSize: true,
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
    description:
      "Premium whey protein isolate delivering 25g of protein per serving with a rich, creamy chocolate flavor. Low in sugar and fat, it mixes smoothly with water or milk. 30 servings per tub, sourced from grass-fed cows for the highest quality.",
    hasSize: false,
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
    description:
      "Supercharge your sessions with our scientifically formulated pre-workout blend. Packed with caffeine, beta-alanine, and citrulline for explosive energy, endurance, and insane pumps. Tropical fruit flavor that actually tastes great.",
    hasSize: false,
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
    description:
      "Accelerate your recovery with our 2:1:1 ratio BCAA formula. Enriched with electrolytes and glutamine to reduce muscle soreness and keep you hydrated. Refreshing berry blast flavor, perfect to sip during or after training.",
    hasSize: false,
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
    description:
      "Pure micronized creatine monohydrate for increased strength, power, and muscle volume. Unflavored and easy to mix into any shake or beverage. 100 servings per container, with no fillers or additives.",
    hasSize: false,
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
    description:
      "Our flagship gym bag built for serious athletes. Features a ventilated shoe compartment, insulated cooler pocket for supplements, padded laptop sleeve, and water-resistant 900D nylon construction. Multiple internal organizer pockets keep your gear sorted.",
    hasSize: false,
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
    description:
      "Leak-proof 24oz shaker bottle with a stainless steel mixing ball for smooth, clump-free shakes every time. BPA-free Tritan plastic with an easy-open flip cap and measurement markings on the side. Branded with the Big Vision logo.",
    hasSize: false,
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
    description:
      "Complete set of 5 color-coded resistance bands ranging from 5 to 50 lbs. Made from premium natural latex for durability and snap resistance. Includes a door anchor, ankle straps, and a carry bag for home or travel workouts.",
    hasSize: false,
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
    description:
      "Full-palm silicone grip gloves that protect your hands and improve your hold on barbells, dumbbells, and pull-up bars. Breathable mesh back with adjustable wrist wrap for added support. Machine washable.",
    hasSize: true,
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  apparel: "Apparel",
  supplements: "Supplements",
  accessories: "Accessories",
  equipment: "Equipment",
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* -------------------------------------------------------------------------- */
/*                           Accordion Section                                */
/* -------------------------------------------------------------------------- */

function AccordionSection({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between py-4 text-left transition-colors hover:text-primary"
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Product Card                                  */
/* -------------------------------------------------------------------------- */

function RelatedProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/20">
      {/* Image placeholder */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative flex h-52 items-center justify-center bg-muted"
      >
        <ShoppingBag className="h-10 w-10 text-muted-foreground/40 transition-transform duration-300 group-hover:scale-110" />
        {product.salePrice !== null && (
          <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            Sale
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          {product.category}
        </span>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-[var(--font-oswald)] text-base font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          {product.salePrice !== null ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-base font-bold text-primary">
                {formatPrice(product.salePrice)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className="flex-1" />
        <Button
          variant="primary"
          size="sm"
          className="mt-3 w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Main Component                                  */
/* -------------------------------------------------------------------------- */

export function ProductDetailContent({ slug }: { slug: string }) {
  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);

  /* ---- Not found ---- */
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-6 h-20 w-20 text-muted-foreground/30" />
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
          Product Not Found
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The product you are looking for does not exist or may have been
          removed.
        </p>
        <Button variant="primary" size="md" className="mt-8">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  /* ---- Related products: same category, different product ---- */
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  /* ---- Add to cart ---- */
  function handleAddToCart() {
    if (!product) return;
    const variantId = product.hasSize ? selectedSize : undefined;
    const variantName = product.hasSize ? `Size ${selectedSize}` : undefined;

    addItem({
      id: variantId ? `${product.id}-${variantId}` : product.id,
      productId: product.id,
      variantId,
      name: product.name,
      variantName,
      price: effectivePrice,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/shop" className="transition-colors hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-primary"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* ---- Two-column layout ---- */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ---- Left: Images ---- */}
          <div>
            {/* Main image placeholder */}
            <div className="relative flex h-96 items-center justify-center rounded-xl bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
              {product.salePrice !== null && (
                <span className="absolute top-4 left-4 rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Sale
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 right-4 rounded-md bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                  Featured
                </span>
              )}
            </div>
            {/* Thumbnail placeholders */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-20 cursor-pointer items-center justify-center rounded-lg bg-muted transition-all hover:ring-2 hover:ring-primary/50",
                    i === 1 && "ring-2 ring-primary"
                  )}
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </div>

          {/* ---- Right: Details ---- */}
          <div>
            {/* Category badge */}
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {categoryLabel}
            </span>

            {/* Product name */}
            <h1 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              {product.salePrice !== null ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    Save{" "}
                    {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Size selector (apparel only) */}
            {product.hasSize && (
              <div className="mt-8">
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                        selectedSize === size
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "border border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-8">
              <label className="mb-3 block text-sm font-semibold text-foreground">
                Quantity
              </label>
              <div className="inline-flex items-center gap-0 overflow-hidden rounded-lg border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-border bg-card text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <Button
              variant="primary"
              size="lg"
              className="mt-8 w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart &mdash; {formatPrice(effectivePrice * quantity)}
            </Button>

            {/* Stock indicator */}
            <p className="mt-3 text-xs text-muted-foreground">
              {product.stockQty > 20
                ? "In Stock"
                : product.stockQty > 0
                  ? `Only ${product.stockQty} left in stock`
                  : "Out of Stock"}
            </p>

            {/* ---- Accordion sections ---- */}
            <div className="mt-8 border-t border-border">
              <AccordionSection
                icon={Package}
                title="Product Details"
                defaultOpen
              >
                <p>{product.description}</p>
                <ul className="mt-3 list-inside list-disc space-y-1">
                  <li>Category: {categoryLabel}</li>
                  <li>SKU: {product.id.toUpperCase()}</li>
                  {product.tags.length > 0 && (
                    <li>
                      Tags:{" "}
                      {product.tags
                        .map((t) => t.replace(/-/g, " "))
                        .join(", ")}
                    </li>
                  )}
                </ul>
              </AccordionSection>

              {product.hasSize && (
                <AccordionSection icon={Ruler} title="Size Guide">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 pr-4 font-semibold text-foreground">
                            Size
                          </th>
                          <th className="py-2 pr-4 font-semibold text-foreground">
                            Chest (in)
                          </th>
                          <th className="py-2 pr-4 font-semibold text-foreground">
                            Waist (in)
                          </th>
                          <th className="py-2 font-semibold text-foreground">
                            Length (in)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { size: "S", chest: "36-38", waist: "29-31", length: "27" },
                          { size: "M", chest: "38-40", waist: "31-33", length: "28" },
                          { size: "L", chest: "40-42", waist: "33-35", length: "29" },
                          { size: "XL", chest: "42-44", waist: "35-37", length: "30" },
                          { size: "XXL", chest: "44-46", waist: "37-39", length: "31" },
                        ].map((row) => (
                          <tr
                            key={row.size}
                            className="border-b border-border/50"
                          >
                            <td className="py-2 pr-4 font-medium text-foreground">
                              {row.size}
                            </td>
                            <td className="py-2 pr-4">{row.chest}</td>
                            <td className="py-2 pr-4">{row.waist}</td>
                            <td className="py-2">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionSection>
              )}

              <AccordionSection icon={Truck} title="Shipping Info">
                <ul className="list-inside list-disc space-y-1">
                  <li>Free standard shipping on orders over $75</li>
                  <li>Standard shipping (5-7 business days): $9.99</li>
                  <li>Express shipping (2-3 business days): $19.99</li>
                  <li>Same-day pickup available at Big Vision Gym</li>
                  <li>30-day hassle-free returns on all items</li>
                </ul>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* ---- Related Products ---- */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              You May Also Like
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rp) => (
                <RelatedProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
