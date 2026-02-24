"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FileSpreadsheet,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type MemberStatus = "Active" | "Frozen" | "Cancelled" | "Expired";
type MemberPlan = "Basic" | "Premium" | "VIP";

interface Member {
  id: string;
  name: string;
  email: string;
  plan: MemberPlan;
  status: MemberStatus;
  joinDate: Date;
  lastVisit: Date;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah.mitchell@email.com", plan: "Premium", status: "Active", joinDate: new Date(2024, 2, 15), lastVisit: new Date(2026, 1, 23) },
  { id: "2", name: "James Rodriguez", email: "james.rod@email.com", plan: "VIP", status: "Active", joinDate: new Date(2023, 8, 1), lastVisit: new Date(2026, 1, 24) },
  { id: "3", name: "Emily Chen", email: "emily.chen@email.com", plan: "Basic", status: "Active", joinDate: new Date(2025, 0, 10), lastVisit: new Date(2026, 1, 22) },
  { id: "4", name: "Michael Brown", email: "m.brown@email.com", plan: "Premium", status: "Frozen", joinDate: new Date(2024, 5, 20), lastVisit: new Date(2026, 0, 15) },
  { id: "5", name: "Lisa Patel", email: "lisa.patel@email.com", plan: "Basic", status: "Active", joinDate: new Date(2025, 4, 5), lastVisit: new Date(2026, 1, 21) },
  { id: "6", name: "David Kim", email: "david.kim@email.com", plan: "VIP", status: "Active", joinDate: new Date(2023, 3, 12), lastVisit: new Date(2026, 1, 24) },
  { id: "7", name: "Anna Kowalski", email: "anna.k@email.com", plan: "Premium", status: "Cancelled", joinDate: new Date(2024, 7, 8), lastVisit: new Date(2025, 11, 30) },
  { id: "8", name: "Chris Taylor", email: "chris.taylor@email.com", plan: "Basic", status: "Expired", joinDate: new Date(2024, 1, 28), lastVisit: new Date(2025, 10, 12) },
  { id: "9", name: "Priya Sharma", email: "priya.s@email.com", plan: "VIP", status: "Active", joinDate: new Date(2023, 11, 3), lastVisit: new Date(2026, 1, 23) },
  { id: "10", name: "Marcus Johnson", email: "marcus.j@email.com", plan: "Premium", status: "Active", joinDate: new Date(2024, 9, 17), lastVisit: new Date(2026, 1, 20) },
  { id: "11", name: "Rachel Green", email: "rachel.g@email.com", plan: "Basic", status: "Frozen", joinDate: new Date(2025, 2, 22), lastVisit: new Date(2026, 0, 5) },
  { id: "12", name: "Kevin Nguyen", email: "kevin.n@email.com", plan: "Premium", status: "Active", joinDate: new Date(2024, 4, 9), lastVisit: new Date(2026, 1, 22) },
  { id: "13", name: "Olivia Santos", email: "olivia.s@email.com", plan: "VIP", status: "Active", joinDate: new Date(2023, 6, 14), lastVisit: new Date(2026, 1, 24) },
  { id: "14", name: "Tom Wilson", email: "tom.w@email.com", plan: "Basic", status: "Cancelled", joinDate: new Date(2025, 1, 1), lastVisit: new Date(2025, 9, 18) },
  { id: "15", name: "Diana Flores", email: "diana.f@email.com", plan: "Premium", status: "Active", joinDate: new Date(2024, 11, 25), lastVisit: new Date(2026, 1, 21) },
];

const TOTAL_MEMBERS = 234;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function planBadgeVariant(plan: MemberPlan) {
  switch (plan) {
    case "Basic":
      return "outline" as const;
    case "Premium":
      return "default" as const;
    case "VIP":
      return "secondary" as const;
  }
}

function statusClasses(status: MemberStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-500/10 text-emerald-400";
    case "Frozen":
      return "bg-blue-500/10 text-blue-400";
    case "Cancelled":
      return "bg-red-500/10 text-red-400";
    case "Expired":
      return "bg-neutral-500/10 text-neutral-400";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | MemberStatus>("All");
  const [planFilter, setPlanFilter] = useState<"All" | MemberPlan>("All");
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "plan">("name");

  const filteredMembers = useMemo(() => {
    let result = [...MOCK_MEMBERS];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((m) => m.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== "All") {
      result = result.filter((m) => m.plan === planFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "joinDate":
          return b.joinDate.getTime() - a.joinDate.getTime();
        case "plan": {
          const order = { VIP: 0, Premium: 1, Basic: 2 };
          return order[a.plan] - order[b.plan];
        }
        default:
          return 0;
      }
    });

    return result;
  }, [search, statusFilter, planFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground">
            Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {TOTAL_MEMBERS} total members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* ── Search & Filters ──────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "All" | MemberStatus)}
                className="h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Frozen">Frozen</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Expired">Expired</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Plan filter */}
            <div className="relative">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as "All" | MemberPlan)}
                className="h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="All">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Sort by */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "joinDate" | "plan")}
                className="h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="name">Sort: Name</option>
                <option value="joinDate">Sort: Join Date</option>
                <option value="plan">Sort: Plan</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Desktop Table ─────────────────────────────────────────────── */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Member
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Visit
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{member.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={planBadgeVariant(member.plan)}>{member.plan}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusClasses(member.status)
                        )}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(member.joinDate, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(member.lastVisit, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          title="View member"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          title="Edit member"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Mobile Card List ──────────────────────────────────────────── */}
      <div className="space-y-3 lg:hidden">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="transition-colors hover:border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Link
                  href={`/admin/members/${member.id}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={planBadgeVariant(member.plan)}>{member.plan}</Badge>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    statusClasses(member.status)
                  )}
                >
                  {member.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Joined {format(member.joinDate, "MMM d, yyyy")}</span>
                <span>Last visit {format(member.lastVisit, "MMM d")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">1-15</span> of{" "}
          <span className="font-medium text-foreground">{TOTAL_MEMBERS}</span> members
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary cursor-pointer">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
              3
            </button>
            <span className="px-1 text-sm text-muted-foreground">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
              16
            </button>
          </div>
          <Button variant="ghost" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
