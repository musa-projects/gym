"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const FREE_SHIPPING_THRESHOLD = 7500; // $75.00
const SHIPPING_COST = 999; // $9.99
const TAX_RATE = 0.08; // 8%

/* -------------------------------------------------------------------------- */
/*                              Cart Skeleton                                 */
/* -------------------------------------------------------------------------- */

function CartSkeleton() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="mb-10 h-10 w-64 animate-pulse rounded-lg bg-muted" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="h-24 w-24 shrink-0 animate-pulse rounded-lg bg-muted" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Empty Cart                                    */
/* -------------------------------------------------------------------------- */

function EmptyCart() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ShoppingBag className="mb-6 h-20 w-20 text-muted-foreground/30" />
      <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
        Your Cart is Empty
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        Looks like you have not added anything to your cart yet. Browse our
        collection and find something you love.
      </p>
      <Link href="/shop">
        <Button variant="primary" size="lg" className="mt-8">
          Browse Products
        </Button>
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Cart Page                                     */
/* -------------------------------------------------------------------------- */

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  if (!mounted) return <CartSkeleton />;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Back link ---- */}
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        {/* ---- Page title ---- */}
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Shopping Cart{" "}
          <span className="text-lg font-normal normal-case text-muted-foreground">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* ================================================================ */}
          {/*                          Cart Items                              */}
          {/* ================================================================ */}
          <div className="lg:col-span-2">
            {/* Header row (desktop) */}
            <div className="hidden border-b border-border pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-12 sm:gap-4">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 py-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                  >
                    {/* Product info */}
                    <div className="col-span-6 flex items-center gap-4">
                      {/* Image placeholder */}
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                          {item.name}
                        </h3>
                        {item.variantName && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        {/* Mobile-only remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-1 cursor-pointer text-xs text-muted-foreground transition-colors hover:text-primary sm:hidden"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Unit price */}
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      <span className="sm:hidden mr-2 text-xs font-semibold uppercase text-muted-foreground/70">
                        Price:
                      </span>
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="inline-flex items-center gap-0 overflow-hidden rounded-lg border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 cursor-pointer items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-10 items-center justify-center border-x border-border bg-card text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 cursor-pointer items-center justify-center bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="col-span-2 flex items-center justify-between sm:justify-end sm:gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        <span className="sm:hidden mr-2 text-xs font-semibold uppercase text-muted-foreground/70">
                          Total:
                        </span>
                        {formatPrice(lineTotal)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="hidden cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary sm:inline-flex"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================================ */}
          {/*                         Order Summary                            */}
          {/* ================================================================ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-tight text-foreground">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Estimated Shipping
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      shipping === 0 ? "text-green-500" : "text-foreground"
                    )}
                  >
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    Free shipping on orders over $75
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Estimated Tax (8%)
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/shop/checkout" className="block mt-6">
                <Button variant="primary" size="lg" className="w-full">
                  <ShieldCheck className="h-5 w-5" />
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue shopping */}
              <Link
                href="/shop"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-border pt-4 text-[11px] text-muted-foreground/60">
                <span>Secure Checkout</span>
                <span>30-Day Returns</span>
                <span>Free Shipping $75+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
