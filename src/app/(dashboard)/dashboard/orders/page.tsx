"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  DollarSign,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Truck,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderStatus = "delivered" | "shipped" | "processing" | "pending";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderNumber: string;
  date: Date;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_ORDERS: Order[] = [
  {
    orderNumber: "ORD-1042",
    date: new Date(2026, 1, 20),
    items: [
      { name: "Premium Whey Protein (Chocolate)", quantity: 1, price: 49.99 },
      { name: "BV Resistance Bands Set", quantity: 1, price: 34.99 },
      { name: "Shaker Bottle - Black", quantity: 1, price: 39.99 },
    ],
    total: 124.97,
    status: "delivered",
  },
  {
    orderNumber: "ORD-1038",
    date: new Date(2026, 1, 12),
    items: [
      { name: "BV Performance Pre-Workout", quantity: 1, price: 54.99 },
    ],
    total: 54.99,
    status: "shipped",
    trackingNumber: "BV-TRK-8847",
  },
  {
    orderNumber: "ORD-1025",
    date: new Date(2026, 0, 28),
    items: [
      { name: "Lifting Gloves (Large)", quantity: 1, price: 29.99 },
      { name: "Wrist Wraps - Red", quantity: 1, price: 39.99 },
    ],
    total: 69.98,
    status: "delivered",
  },
  {
    orderNumber: "ORD-1019",
    date: new Date(2026, 0, 15),
    items: [
      { name: "BV Gym Duffle Bag", quantity: 1, price: 79.99 },
    ],
    total: 79.99,
    status: "delivered",
  },
  {
    orderNumber: "ORD-1003",
    date: new Date(2025, 11, 22),
    items: [
      { name: "Premium Whey Protein (Vanilla)", quantity: 2, price: 49.99 },
      { name: "Creatine Monohydrate", quantity: 1, price: 34.99 },
      { name: "BV Branded Tank Top (M)", quantity: 1, price: 24.99 },
    ],
    total: 159.96,
    status: "delivered",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    dot: "bg-purple-500",
  },
  processing: {
    label: "Processing",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    dot: "bg-blue-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    dot: "bg-yellow-500",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.bg,
        cfg.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Summary cards
// ---------------------------------------------------------------------------

function SummaryCards() {
  const totalOrders = MOCK_ORDERS.length;
  const totalSpent = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);
  const lastOrderDate = MOCK_ORDERS[0].date;

  const cards = [
    {
      label: "Total Orders",
      value: String(totalOrders),
      icon: Package,
      iconColor: "bg-primary/10 text-primary",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      iconColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Last Order",
      value: formatDate(lastOrderDate),
      icon: CalendarDays,
      iconColor: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  card.iconColor,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order card
// ---------------------------------------------------------------------------

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reordered, setReordered] = useState(false);

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReorder = () => {
    setReordered(true);
    setTimeout(() => setReordered(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg transition-all">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wider text-foreground">
              {order.orderNumber}
            </p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(order.date)} &middot; {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}
          </p>

          {/* Compact items preview */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
            {order.items.map((item, idx) => (
              <span key={idx} className="text-xs text-muted-foreground">
                {item.name}
                {item.quantity > 1 && (
                  <span className="text-muted-foreground/60">
                    {" "}
                    x{item.quantity}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(order.total)}
          </p>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded detail view */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {/* Item breakdown */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items
            </p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total row */}
            <div className="mt-2 flex items-center justify-between border-t border-border px-4 pt-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Order Total
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          {/* Shipping info */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shipping
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
              <Truck className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                {order.status === "delivered" ? (
                  <p className="text-sm text-emerald-500 font-medium">
                    Delivered on {formatDate(order.date)}
                  </p>
                ) : order.status === "shipped" ? (
                  <p className="text-sm text-purple-500 font-medium">
                    In transit &mdash; estimated delivery in 2-3 business days
                  </p>
                ) : order.status === "processing" ? (
                  <p className="text-sm text-blue-500 font-medium">
                    Order is being prepared
                  </p>
                ) : (
                  <p className="text-sm text-yellow-500 font-medium">
                    Awaiting confirmation
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking number */}
          {order.trackingNumber && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tracking Number
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-border bg-muted px-4 py-2.5">
                  <code className="font-mono text-sm font-semibold text-foreground">
                    {order.trackingNumber}
                  </code>
                </div>
                <button
                  onClick={handleCopyTracking}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all cursor-pointer",
                    copied
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Reorder button */}
          <button
            onClick={handleReorder}
            disabled={reordered}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer",
              reordered
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-red-600 hover:shadow-primary/40",
            )}
          >
            {reordered ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart!
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Reorder
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your order history, track shipments, and reorder your
            favorites.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-red-600 hover:shadow-primary/40"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Orders list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Order History</h2>

        {MOCK_ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center shadow-lg">
            <Package className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No orders yet
            </p>
            <p className="text-xs text-muted-foreground/60">
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => (
              <OrderCard key={order.orderNumber} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
