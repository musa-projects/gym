"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dumbbell,
  ShoppingBag,
  Ticket,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";
type PaymentType = "subscription" | "pt_session" | "shop" | "guest_pass";

interface Payment {
  id: string;
  date: Date;
  member_name: string;
  description: string;
  amount: number; // dollars (not cents, for simpler display)
  type: PaymentType;
  status: PaymentStatus;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; dot: string }> = {
  succeeded: { label: "Succeeded", color: "text-green-400", bg: "bg-green-500/10", dot: "bg-green-500" },
  pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-500" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-500" },
  refunded: { label: "Refunded", color: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-500" },
};

// ---------------------------------------------------------------------------
// Type config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<PaymentType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  subscription: { label: "Subscription", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
  pt_session: { label: "PT Session", icon: Dumbbell, color: "text-secondary", bg: "bg-secondary/10" },
  shop: { label: "Shop", icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10" },
  guest_pass: { label: "Guest Pass", icon: Ticket, color: "text-cyan-400", bg: "bg-cyan-500/10" },
};

// ---------------------------------------------------------------------------
// Revenue chart data (28 days in Feb)
// ---------------------------------------------------------------------------

const REVENUE_CHART_DATA = Array.from({ length: 24 }, (_, i) => ({
  day: `Feb ${i + 1}`,
  revenue: Math.floor(1800 + Math.random() * 2500 + (i % 7 === 0 || i % 7 === 6 ? 500 : 0)),
}));

// ---------------------------------------------------------------------------
// Mock payments — 20 records
// ---------------------------------------------------------------------------

const MOCK_PAYMENTS: Payment[] = [
  { id: "pay_01", date: new Date(2026, 1, 24), member_name: "James Wilson", description: "Premium Membership - Monthly", amount: 79.00, type: "subscription", status: "succeeded" },
  { id: "pay_02", date: new Date(2026, 1, 24), member_name: "Maria Garcia", description: "Personal Training - Marcus Cole", amount: 75.00, type: "pt_session", status: "succeeded" },
  { id: "pay_03", date: new Date(2026, 1, 24), member_name: "Tyler Brooks", description: "Protein Shake Bundle", amount: 32.00, type: "shop", status: "succeeded" },
  { id: "pay_04", date: new Date(2026, 1, 23), member_name: "Ashley Chen", description: "Elite Membership - Monthly", amount: 129.00, type: "subscription", status: "succeeded" },
  { id: "pay_05", date: new Date(2026, 1, 23), member_name: "Nicole Foster", description: "Personal Training - Sarah Chen", amount: 75.00, type: "pt_session", status: "pending" },
  { id: "pay_06", date: new Date(2026, 1, 23), member_name: "Kevin Thompson", description: "Day Pass", amount: 25.00, type: "guest_pass", status: "succeeded" },
  { id: "pay_07", date: new Date(2026, 1, 22), member_name: "Brandon Miller", description: "Basic Membership - Monthly", amount: 49.00, type: "subscription", status: "succeeded" },
  { id: "pay_08", date: new Date(2026, 1, 22), member_name: "Rachel Adams", description: "Yoga Mat + Blocks Set", amount: 45.00, type: "shop", status: "succeeded" },
  { id: "pay_09", date: new Date(2026, 1, 22), member_name: "Derek Patel", description: "Personal Training - David Okafor", amount: 75.00, type: "pt_session", status: "failed" },
  { id: "pay_10", date: new Date(2026, 1, 21), member_name: "Samantha Lee", description: "Premium Membership - Monthly", amount: 79.00, type: "subscription", status: "succeeded" },
  { id: "pay_11", date: new Date(2026, 1, 21), member_name: "Marcus Johnson", description: "Week Pass", amount: 55.00, type: "guest_pass", status: "succeeded" },
  { id: "pay_12", date: new Date(2026, 1, 20), member_name: "Emily Rodriguez", description: "Personal Training - Aisha Patel", amount: 75.00, type: "pt_session", status: "succeeded" },
  { id: "pay_13", date: new Date(2026, 1, 20), member_name: "David Kim", description: "Elite Membership - Monthly", amount: 129.00, type: "subscription", status: "refunded" },
  { id: "pay_14", date: new Date(2026, 1, 19), member_name: "Sophia Martinez", description: "BCAAs + Pre-Workout Bundle", amount: 68.00, type: "shop", status: "succeeded" },
  { id: "pay_15", date: new Date(2026, 1, 19), member_name: "Ryan O'Brien", description: "Premium Membership - Monthly", amount: 79.00, type: "subscription", status: "succeeded" },
  { id: "pay_16", date: new Date(2026, 1, 18), member_name: "Jennifer Chang", description: "Personal Training - Marcus Cole", amount: 75.00, type: "pt_session", status: "succeeded" },
  { id: "pay_17", date: new Date(2026, 1, 18), member_name: "Chris Taylor", description: "Day Pass", amount: 25.00, type: "guest_pass", status: "pending" },
  { id: "pay_18", date: new Date(2026, 1, 17), member_name: "James Wilson", description: "Gym Gloves + Wrist Wraps", amount: 38.00, type: "shop", status: "succeeded" },
  { id: "pay_19", date: new Date(2026, 1, 17), member_name: "Maria Garcia", description: "Premium Membership - Refund", amount: 79.00, type: "subscription", status: "refunded" },
  { id: "pay_20", date: new Date(2026, 1, 16), member_name: "Tyler Brooks", description: "Personal Training - Emily Rodriguez", amount: 75.00, type: "pt_session", status: "pending" },
];

// ---------------------------------------------------------------------------
// Chart tooltip
// ---------------------------------------------------------------------------

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI Cards
// ---------------------------------------------------------------------------

function RevenueKPIs() {
  const kpis = [
    {
      label: "Today's Revenue",
      value: "$2,340",
      icon: DollarSign,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      change: null,
    },
    {
      label: "This Month",
      value: "$108,450",
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      change: "+15%",
      changePositive: true,
    },
    {
      label: "Outstanding",
      value: "$4,200",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      change: "3 pending",
      changePositive: false,
    },
    {
      label: "Refunded",
      value: "$590",
      icon: RotateCcw,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      change: "2 this month",
      changePositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-5">
          <div className="flex items-center justify-between">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", kpi.iconBg)}>
              <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} />
            </div>
            {kpi.change && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  kpi.changePositive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {kpi.changePositive && <ArrowUpRight className="h-3 w-3" />}
                {kpi.change}
              </span>
            )}
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Revenue chart
// ---------------------------------------------------------------------------

function RevenueChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
            <TrendingUp className="h-3 w-3" />
            +15% vs last month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_CHART_DATA}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a3a3a3", fontSize: 11 }}
                interval={3}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a3a3a3", fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ef4444", strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Status & Type badges
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.bg, cfg.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: PaymentType }) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", cfg.bg, cfg.color)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Payments table
// ---------------------------------------------------------------------------

function PaymentsTable({
  payments,
  onRefund,
}: {
  payments: Payment[];
  onRefund: (id: string) => void;
}) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center shadow-lg">
        <DollarSign className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">No payments found</p>
        <p className="text-xs text-muted-foreground/60">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-lg lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors hover:bg-accent/30">
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                  {format(payment.date, "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {payment.member_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-foreground">{payment.member_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-foreground max-w-[200px] truncate">
                  {payment.description}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-foreground">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <TypeBadge type={payment.type} />
                </td>
                <td className="px-4 py-3.5 text-center">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  {payment.status === "succeeded" ? (
                    <button
                      onClick={() => onRefund(payment.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/10 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Refund
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground/40">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 lg:hidden">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {payment.member_name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{payment.member_name}</p>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{payment.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{format(payment.date, "MMM d, yyyy")}</p>
              </div>
              <StatusBadge status={payment.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">${payment.amount.toFixed(2)}</span>
                <TypeBadge type={payment.type} />
              </div>
              {payment.status === "succeeded" && (
                <button
                  onClick={() => onRefund(payment.id)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/10 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Refund
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span> to{" "}
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span> payments
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer",
              page === currentPage
                ? "bg-primary/10 text-primary border border-primary/30"
                : "border border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<PaymentType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (p.date < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (p.date > to) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.member_name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.amount.toFixed(2).includes(q)
        )
          return false;
      }
      return true;
    });
  }, [payments, search, statusFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPayments = filteredPayments.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const handleRefund = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "refunded" as PaymentStatus } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Payments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track revenue, manage payments, and process refunds
        </p>
      </div>

      {/* Revenue KPI Cards */}
      <RevenueKPIs />

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search member, description, amount..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PaymentStatus | "all");
              setCurrentPage(1);
            }}
            className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as PaymentType | "all");
              setCurrentPage(1);
            }}
            className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="pt_session">PT Session</option>
            <option value="shop">Shop</option>
            <option value="guest_pass">Guest Pass</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="From"
            className="h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer [color-scheme:dark]"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="To"
            className="h-10 rounded-xl border border-border bg-muted px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <PaymentsTable payments={paginatedPayments} onRefund={handleRefund} />

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={filteredPayments.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
