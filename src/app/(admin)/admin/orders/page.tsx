"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Truck,
  FileSpreadsheet,
  Eye,
  ChevronDown,
  X,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type PaymentStatus = "paid" | "unpaid";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  shippingAddress: string;
}

// ─── Status Config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  confirmed: { label: "Confirmed", color: "text-blue-500", bg: "bg-blue-500/10" },
  processing: { label: "Processing", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  shipped: { label: "Shipped", color: "text-purple-500", bg: "bg-purple-500/10" },
  delivered: { label: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10" },
  refunded: { label: "Refunded", color: "text-gray-500", bg: "bg-gray-500/10" },
};

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord_1",
    orderNumber: "ORD-001",
    customerName: "James Wilson",
    customerEmail: "james.wilson@email.com",
    items: [
      { name: "Performance T-Shirt (Black)", quantity: 2, price: 34.99 },
      { name: "Shaker Bottle", quantity: 1, price: 14.99 },
    ],
    itemsCount: 3,
    subtotal: 84.97,
    shipping: 5.99,
    tax: 7.20,
    total: 98.16,
    status: "pending",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 24, 14, 32),
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "ord_2",
    orderNumber: "ORD-002",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    items: [
      { name: "Whey Protein (Chocolate)", quantity: 1, price: 54.99 },
      { name: "Pre-Workout Formula", quantity: 1, price: 39.99 },
    ],
    itemsCount: 2,
    subtotal: 94.98,
    shipping: 5.99,
    tax: 8.07,
    total: 109.04,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date(2026, 1, 24, 11, 15),
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90012",
  },
  {
    id: "ord_3",
    orderNumber: "ORD-003",
    customerName: "Tyler Brooks",
    customerEmail: "tyler.b@email.com",
    items: [
      { name: "Gym Hoodie", quantity: 1, price: 54.99 },
      { name: "Gym Bag (Pro)", quantity: 1, price: 79.99 },
    ],
    itemsCount: 2,
    subtotal: 134.98,
    shipping: 0,
    tax: 11.47,
    total: 146.45,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 23, 16, 48),
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: "ord_4",
    orderNumber: "ORD-004",
    customerName: "Ashley Chen",
    customerEmail: "ashley.chen@email.com",
    items: [
      { name: "Resistance Bands Set", quantity: 2, price: 34.99 },
    ],
    itemsCount: 2,
    subtotal: 69.98,
    shipping: 5.99,
    tax: 5.95,
    total: 81.92,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 23, 9, 22),
    shippingAddress: "321 Elm St, Houston, TX 77002",
  },
  {
    id: "ord_5",
    orderNumber: "ORD-005",
    customerName: "Kevin Thompson",
    customerEmail: "kevin.t@email.com",
    items: [
      { name: "Performance T-Shirt (Black)", quantity: 3, price: 34.99 },
      { name: "Shaker Bottle", quantity: 2, price: 14.99 },
    ],
    itemsCount: 5,
    subtotal: 134.95,
    shipping: 0,
    tax: 11.47,
    total: 146.42,
    status: "processing",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 22, 13, 10),
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
  },
  {
    id: "ord_6",
    orderNumber: "ORD-006",
    customerName: "Rachel Adams",
    customerEmail: "rachel.a@email.com",
    items: [
      { name: "Whey Protein (Chocolate)", quantity: 2, price: 54.99 },
      { name: "Shaker Bottle", quantity: 1, price: 14.99 },
    ],
    itemsCount: 3,
    subtotal: 124.97,
    shipping: 5.99,
    tax: 10.62,
    total: 141.58,
    status: "processing",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 21, 10, 45),
    shippingAddress: "987 Cedar Ln, Philadelphia, PA 19103",
  },
  {
    id: "ord_7",
    orderNumber: "ORD-007",
    customerName: "Brandon Miller",
    customerEmail: "brandon.m@email.com",
    items: [
      { name: "Gym Bag (Pro)", quantity: 1, price: 79.99 },
      { name: "Resistance Bands Set", quantity: 1, price: 34.99 },
      { name: "Shaker Bottle", quantity: 2, price: 14.99 },
    ],
    itemsCount: 4,
    subtotal: 144.96,
    shipping: 0,
    tax: 12.32,
    total: 157.28,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 20, 15, 30),
    shippingAddress: "147 Birch Way, San Antonio, TX 78201",
  },
  {
    id: "ord_8",
    orderNumber: "ORD-008",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@email.com",
    items: [
      { name: "Gym Hoodie", quantity: 2, price: 54.99 },
    ],
    itemsCount: 2,
    subtotal: 109.98,
    shipping: 5.99,
    tax: 9.35,
    total: 125.32,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 19, 8, 20),
    shippingAddress: "258 Walnut St, San Diego, CA 92101",
  },
  {
    id: "ord_9",
    orderNumber: "ORD-009",
    customerName: "Derek Patel",
    customerEmail: "derek.p@email.com",
    items: [
      { name: "Performance T-Shirt (Black)", quantity: 1, price: 34.99 },
      { name: "Whey Protein (Chocolate)", quantity: 1, price: 54.99 },
      { name: "Pre-Workout Formula", quantity: 1, price: 39.99 },
    ],
    itemsCount: 3,
    subtotal: 129.97,
    shipping: 0,
    tax: 11.05,
    total: 141.02,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: new Date(2026, 1, 17, 12, 55),
    shippingAddress: "369 Spruce Ave, Dallas, TX 75201",
  },
  {
    id: "ord_10",
    orderNumber: "ORD-010",
    customerName: "Nicole Foster",
    customerEmail: "nicole.f@email.com",
    items: [
      { name: "Old Logo Tee", quantity: 5, price: 19.99 },
      { name: "Shaker Bottle", quantity: 5, price: 14.99 },
    ],
    itemsCount: 10,
    subtotal: 174.90,
    shipping: 0,
    tax: 14.87,
    total: 189.77,
    status: "cancelled",
    paymentStatus: "unpaid",
    createdAt: new Date(2026, 1, 16, 17, 40),
    shippingAddress: "741 Aspen Ct, San Jose, CA 95101",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ── Derived stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders
      .filter((o) => o.paymentStatus === "paid" && o.status !== "cancelled" && o.status !== "refunded")
      .reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    return { totalOrders, revenue, pending, shipped };
  }, [orders]);

  // ── Status counts ──────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const order of orders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  // ── Filtered orders ────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // ── Selected order ─────────────────────────────────────────────────────
  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // ── Update order status ────────────────────────────────────────────────
  function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order status updated to "${STATUS_CONFIG[newStatus].label}".`);
  }

  // ── KPI cards ──────────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Revenue",
      value: formatUSD(stats.revenue),
      icon: DollarSign,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      label: "Shipped",
      value: stats.shipped.toString(),
      icon: Truck,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
  ];

  // ── Filter tabs ────────────────────────────────────────────────────────
  const filterTabs: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground">
            Order Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage merchandise orders
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.success("Orders exported to CSV.")}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export
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

      {/* ── Status Filter Tabs ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const count = statusCounts[tab.value] || 0;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                  statusFilter === tab.value
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-background text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Orders Table (Desktop) ───────────────────────────────────────── */}
      <Card className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order #
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Items
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status];
                return (
                  <tr
                    key={order.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50 cursor-pointer",
                      selectedOrderId === order.id && "bg-muted/50"
                    )}
                    onClick={() =>
                      setSelectedOrderId(selectedOrderId === order.id ? null : order.id)
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-foreground">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {order.customerName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-foreground">{order.itemsCount}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-foreground">
                        {formatUSD(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          order.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}
                      >
                        {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusCfg.bg,
                          statusCfg.color
                        )}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {format(order.createdAt, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                          title="View order"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* Status dropdown */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="h-8 appearance-none rounded-lg border border-border bg-background pl-2 pr-7 text-xs text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No orders found
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Try adjusting your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Orders Cards (Mobile) ────────────────────────────────────────── */}
      <div className="space-y-3 lg:hidden">
        {filteredOrders.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status];
          return (
            <Card
              key={order.id}
              className="p-4 transition-colors hover:border-primary/30 cursor-pointer"
              onClick={() =>
                setSelectedOrderId(selectedOrderId === order.id ? null : order.id)
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    statusCfg.bg,
                    statusCfg.color
                  )}
                >
                  {statusCfg.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">{formatUSD(order.total)}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                      order.paymentStatus === "paid"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.itemsCount} items
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {format(order.createdAt, "MMM d, yyyy 'at' h:mm a")}
              </div>
            </Card>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
            <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* ── Order Detail Slide-Over ──────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrderId(null)}
          />

          {/* Panel */}
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl overflow-y-auto">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-tight text-foreground">
                  {selectedOrder.orderNumber}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(selectedOrder.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-6">
              {/* Status + Payment */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                    STATUS_CONFIG[selectedOrder.status].bg,
                    STATUS_CONFIG[selectedOrder.status].color
                  )}
                >
                  {STATUS_CONFIG[selectedOrder.status].label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                    selectedOrder.paymentStatus === "paid"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  {selectedOrder.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>

              {/* Customer info */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" />
                  Customer
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedOrder.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedOrder.customerEmail}
                </p>
              </div>

              {/* Shipping address */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Shipping Address
                </div>
                <p className="text-sm text-foreground">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  Items ({selectedOrder.itemsCount})
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatUSD(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment details */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  Payment Summary
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatUSD(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {selectedOrder.shipping === 0 ? "Free" : formatUSD(selectedOrder.shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatUSD(selectedOrder.tax)}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Total</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatUSD(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status timeline */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Status Timeline
                </div>
                <div className="space-y-0">
                  {STATUS_FLOW.map((step, i) => {
                    const stepIdx = STATUS_FLOW.indexOf(step);
                    const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status as OrderStatus);
                    const isCancelled = selectedOrder.status === "cancelled" || selectedOrder.status === "refunded";
                    const isCompleted = !isCancelled && currentIdx >= stepIdx;
                    const isCurrent = !isCancelled && selectedOrder.status === step;

                    return (
                      <div key={step} className="flex items-start gap-3">
                        {/* Vertical line + dot */}
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                              isCompleted
                                ? "border-primary bg-primary"
                                : "border-border bg-background"
                            )}
                          >
                            {isCompleted && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                            )}
                          </div>
                          {i < STATUS_FLOW.length - 1 && (
                            <div
                              className={cn(
                                "w-0.5 h-6",
                                isCompleted && !isCurrent ? "bg-primary" : "bg-border"
                              )}
                            />
                          )}
                        </div>
                        <div className="pb-4">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isCompleted ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {STATUS_CONFIG[step].label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {(selectedOrder.status === "cancelled" || selectedOrder.status === "refunded") && (
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-red-500">
                          <X className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-400">
                          {STATUS_CONFIG[selectedOrder.status].label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Update status */}
              <div className="rounded-xl border border-border bg-background p-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Update Status
                </label>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
