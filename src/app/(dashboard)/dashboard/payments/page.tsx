"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  CreditCard,
  DollarSign,
  CalendarClock,
  Search,
  ChevronDown,
  Download,
  Plus,
  Pencil,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
type DateRange = "this_month" | "3_months" | "6_months" | "this_year" | "all";

interface Payment {
  id: string;
  date: Date;
  description: string;
  amount: number; // cents
  status: PaymentStatus;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay_001",
    date: new Date(2026, 1, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
  {
    id: "pay_002",
    date: new Date(2026, 1, 10),
    description: "Personal Training Session - Marcus Cole",
    amount: 7500,
    status: "paid",
  },
  {
    id: "pay_003",
    date: new Date(2026, 1, 3),
    description: "Protein Shake Bundle (Shop)",
    amount: 3200,
    status: "paid",
  },
  {
    id: "pay_004",
    date: new Date(2026, 0, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
  {
    id: "pay_005",
    date: new Date(2026, 0, 8),
    description: "Personal Training Session - Marcus Cole",
    amount: 7500,
    status: "refunded",
  },
  {
    id: "pay_006",
    date: new Date(2025, 11, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
  {
    id: "pay_007",
    date: new Date(2025, 11, 2),
    description: "Personal Training Session - Aisha Patel",
    amount: 7500,
    status: "paid",
  },
  {
    id: "pay_008",
    date: new Date(2025, 10, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
  {
    id: "pay_009",
    date: new Date(2025, 10, 20),
    description: "Guest Pass - Day Entry",
    amount: 1500,
    status: "failed",
  },
  {
    id: "pay_010",
    date: new Date(2025, 9, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
  {
    id: "pay_011",
    date: new Date(2025, 9, 5),
    description: "Personal Training Session - Marcus Cole",
    amount: 7500,
    status: "pending",
  },
  {
    id: "pay_012",
    date: new Date(2025, 8, 15),
    description: "Premium Membership - Monthly",
    amount: 5900,
    status: "paid",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  paid: {
    label: "Paid",
    bg: "bg-green-500/10",
    text: "text-green-500",
    dot: "bg-green-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    dot: "bg-yellow-500",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-500/10",
    text: "text-red-500",
    dot: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    dot: "bg-blue-500",
  },
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function getDateRangeStart(range: DateRange): Date | null {
  const now = new Date();
  switch (range) {
    case "this_month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "3_months":
      return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case "6_months":
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case "this_year":
      return new Date(now.getFullYear(), 0, 1);
    case "all":
    default:
      return null;
  }
}

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  this_month: "This Month",
  "3_months": "Last 3 Months",
  "6_months": "Last 6 Months",
  this_year: "This Year",
  all: "All Time",
};

// ---------------------------------------------------------------------------
// Summary cards
// ---------------------------------------------------------------------------

function SummaryCards() {
  const thisYearTotal = MOCK_PAYMENTS.filter(
    (p) => p.date.getFullYear() === 2026 && p.status === "paid"
  ).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Spent */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Spent (This Year)
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(thisYearTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Next Payment */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
            <CalendarClock className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Next Payment
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(5900)}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                on Mar 15
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <CreditCard className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Payment Method
            </p>
            <p className="text-lg font-bold text-foreground">
              Visa ending 4242
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: PaymentStatus | "all";
  onStatusFilterChange: (v: PaymentStatus | "all") => void;
  dateRange: DateRange;
  onDateRangeChange: (v: DateRange) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as PaymentStatus | "all")
          }
          className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Date range */}
      <div className="relative">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
          className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-48 cursor-pointer"
        >
          {(Object.entries(DATE_RANGE_LABELS) as [DateRange, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment table (desktop) / card list (mobile)
// ---------------------------------------------------------------------------

function PaymentTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <DollarSign className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No payments found
        </p>
        <p className="text-xs text-muted-foreground/60">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors hover:bg-accent/30"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {format(payment.date, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {payment.description}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-foreground">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  {payment.status === "paid" ? (
                    <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 cursor-pointer">
                      <Download className="h-3.5 w-3.5" />
                      Receipt
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
      <div className="space-y-3 md:hidden">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {payment.description}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(payment.date, "MMM d, yyyy")}
                </p>
              </div>
              <StatusBadge status={payment.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(payment.amount)}
              </p>
              {payment.status === "paid" && (
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  Receipt
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
// Payment method management
// ---------------------------------------------------------------------------

function PaymentMethodCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Payment Method
      </h2>

      {/* Current card */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <CreditCard className="h-6 w-6 text-blue-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Visa **** **** **** 4242
          </p>
          <p className="text-xs text-muted-foreground">Expires 12/27</p>
        </div>
        <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500">
          Active
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-red-600 hover:shadow-primary/40 cursor-pointer">
          <Pencil className="h-4 w-4" />
          Update Payment Method
        </button>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all"
  );
  const [dateRange, setDateRange] = useState<DateRange>("6_months");

  const filteredPayments = useMemo(() => {
    const rangeStart = getDateRangeStart(dateRange);
    const query = search.toLowerCase().trim();

    return MOCK_PAYMENTS.filter((p) => {
      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) return false;

      // Date range filter
      if (rangeStart && p.date < rangeStart) return false;

      // Search filter
      if (
        query &&
        !p.description.toLowerCase().includes(query) &&
        !formatCurrency(p.amount).toLowerCase().includes(query)
      ) {
        return false;
      }

      return true;
    });
  }, [search, statusFilter, dateRange]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your billing history, manage payment methods, and download
          receipts.
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Payment history section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Payment History</h2>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <PaymentTable payments={filteredPayments} />
      </div>

      {/* Payment method management */}
      <PaymentMethodCard />
    </div>
  );
}
