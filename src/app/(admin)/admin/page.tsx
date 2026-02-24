"use client";

import {
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Target,
  Clock,
  CalendarCheck,
  Bookmark,
  UserCheck,
  Activity,
  Dumbbell,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const kpiCards = [
  {
    label: "Total Members",
    value: "2,341",
    change: "+12%",
    changeLabel: "this month",
    positive: true,
    icon: Users,
  },
  {
    label: "Active Subscriptions",
    value: "1,847",
    change: "+8%",
    changeLabel: "this month",
    positive: true,
    icon: UserCheck,
  },
  {
    label: "Monthly Revenue",
    value: "$108,450",
    change: "+15%",
    changeLabel: "vs last month",
    positive: true,
    icon: DollarSign,
  },
  {
    label: "New Leads",
    value: "156",
    change: "+22%",
    changeLabel: "this month",
    positive: true,
    icon: UserPlus,
  },
  {
    label: "Conversion Rate",
    value: "34.2%",
    change: "+3.1pp",
    changeLabel: "vs last month",
    positive: true,
    icon: Target,
  },
  {
    label: "Avg Retention",
    value: "8.4 mo",
    change: "-0.2",
    changeLabel: "vs last month",
    positive: false,
    icon: Clock,
  },
];

const revenueData = [
  { month: "Jan", revenue: 78200 },
  { month: "Feb", revenue: 82100 },
  { month: "Mar", revenue: 79400 },
  { month: "Apr", revenue: 85600 },
  { month: "May", revenue: 88900 },
  { month: "Jun", revenue: 91200 },
  { month: "Jul", revenue: 87300 },
  { month: "Aug", revenue: 93800 },
  { month: "Sep", revenue: 96500 },
  { month: "Oct", revenue: 101200 },
  { month: "Nov", revenue: 104800 },
  { month: "Dec", revenue: 108450 },
];

const memberGrowthData = [
  { month: "Jul", newMembers: 42, churned: 12 },
  { month: "Aug", newMembers: 56, churned: 15 },
  { month: "Sep", newMembers: 48, churned: 10 },
  { month: "Oct", newMembers: 63, churned: 18 },
  { month: "Nov", newMembers: 51, churned: 14 },
  { month: "Dec", newMembers: 72, churned: 11 },
];

const recentActivity = [
  {
    id: "1",
    type: "signup",
    user: "Sarah Mitchell",
    description: "New member signed up for Premium plan",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "2",
    type: "booking",
    user: "James Rodriguez",
    description: "Booked HIIT Blast class for tomorrow",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
  },
  {
    id: "3",
    type: "payment",
    user: "Emily Chen",
    description: "Payment of $79.99 processed successfully",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "lead",
    user: "Michael Brown",
    description: "Submitted free trial inquiry via website",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "signup",
    user: "Lisa Patel",
    description: "New member signed up for Basic plan",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "6",
    type: "booking",
    user: "David Kim",
    description: "Booked Boxing Fundamentals with Okafor",
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    id: "7",
    type: "payment",
    user: "Anna Kowalski",
    description: "VIP renewal payment of $149.99 received",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "8",
    type: "lead",
    user: "Chris Taylor",
    description: "Called about group training packages",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

const topClasses = [
  { name: "HIIT", bookings: 145, max: 145 },
  { name: "CrossFit", bookings: 120, max: 145 },
  { name: "Boxing", bookings: 98, max: 145 },
  { name: "Strength", bookings: 87, max: 145 },
  { name: "Yoga", bookings: 76, max: 145 },
];

const quickStats = [
  { label: "Classes Today", value: 12, icon: Dumbbell, color: "text-primary" },
  { label: "Bookings Today", value: 89, icon: Bookmark, color: "text-secondary" },
  { label: "Check-ins Today", value: 67, icon: CalendarCheck, color: "text-emerald-400" },
  { label: "Upcoming Trials", value: 8, icon: UserPlus, color: "text-blue-400" },
];

// ─── Custom Tooltips ─────────────────────────────────────────────────────────

function RevenueTooltip({
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

function MemberGrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.dataKey === "newMembers" ? "New" : "Churned"}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Activity helpers ────────────────────────────────────────────────────────

function activityIcon(type: string) {
  switch (type) {
    case "signup":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
          <UserPlus className="h-4 w-4 text-emerald-400" />
        </div>
      );
    case "booking":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <CalendarCheck className="h-4 w-4 text-primary" />
        </div>
      );
    case "payment":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
          <CreditCard className="h-4 w-4 text-secondary" />
        </div>
      );
    case "lead":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <MessageSquare className="h-4 w-4 text-blue-400" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      );
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Title ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight text-foreground">
          Analytics <span className="text-primary">Overview</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your gym&apos;s performance at a glance
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="group transition-colors hover:border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    kpi.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  )}
                >
                  {kpi.positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.change}
                </span>
              </div>
              <p className="mt-3 text-xl font-bold text-foreground lg:text-2xl">{kpi.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Revenue & Member Growth Charts ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#ef4444", strokeOpacity: 0.2 }} />
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

        {/* Member Growth Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Growth</CardTitle>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
                New Members
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted-foreground/40" />
                Churned
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberGrowthData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<MemberGrowthTooltip />} cursor={{ fill: "rgba(239, 68, 68, 0.05)" }} />
                  <Bar dataKey="newMembers" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="churned" fill="#525252" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Activity Feed & Top Classes ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-border/80"
                >
                  {activityIcon(item.type)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.user}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Classes This Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Classes</CardTitle>
            <p className="text-xs text-muted-foreground">By bookings this month</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClasses.map((cls, i) => (
                <div key={cls.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{cls.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{cls.bookings}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${(cls.bookings / cls.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Stats Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="group transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10")}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
