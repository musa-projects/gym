"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Flame,
  CalendarCheck,
  Crown,
  Clock,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, formatDistanceToNow, differenceInDays, addDays } from "date-fns";
import { cn, formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── Demo / Mock Data ──────────────────────────────────────────────────────────

const MOCK_STATS = {
  totalWorkouts: 12,
  workoutChange: 3,
  currentStreak: 5,
  classesBooked: 3,
  membershipPlan: "Premium",
  membershipStatus: "Active" as const,
};

const MOCK_UPCOMING_CLASSES = [
  {
    id: "1",
    name: "HIIT Blast",
    trainer: "Marcus Johnson",
    date: addDays(new Date(), 1),
    time: "07:00 AM",
    duration: 45,
  },
  {
    id: "2",
    name: "Power Yoga",
    trainer: "Sarah Chen",
    date: addDays(new Date(), 2),
    time: "09:30 AM",
    duration: 60,
  },
  {
    id: "3",
    name: "Boxing Fundamentals",
    trainer: "David Okafor",
    date: addDays(new Date(), 3),
    time: "06:00 PM",
    duration: 50,
  },
  {
    id: "4",
    name: "Spin & Burn",
    trainer: "Emily Rodriguez",
    date: addDays(new Date(), 5),
    time: "08:00 AM",
    duration: 40,
  },
];

const MOCK_MEMBERSHIP = {
  plan: "Premium",
  status: "Active" as const,
  startDate: new Date(2025, 11, 1),
  endDate: new Date(2026, 11, 1),
  pricePerMonth: 7999, // cents
};

const MOCK_WEEKLY_ACTIVITY = [
  { day: "Mon", workouts: 1 },
  { day: "Tue", workouts: 2 },
  { day: "Wed", workouts: 0 },
  { day: "Thu", workouts: 1 },
  { day: "Fri", workouts: 2 },
  { day: "Sat", workouts: 1 },
  { day: "Sun", workouts: 0 },
];

const MOCK_RECENT_ACTIVITY = [
  {
    id: "a1",
    type: "class_attended" as const,
    title: "Attended HIIT Blast",
    description: "45 min session with Marcus Johnson",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "a2",
    type: "class_booked" as const,
    title: "Booked Power Yoga",
    description: "Scheduled for tomorrow at 9:30 AM",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "a3",
    type: "payment_made" as const,
    title: "Monthly payment processed",
    description: formatCurrency(7999) + " - Premium Plan",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "a4",
    type: "class_attended" as const,
    title: "Attended Boxing Fundamentals",
    description: "50 min session with David Okafor",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "a5",
    type: "class_cancelled" as const,
    title: "Cancelled Spin & Burn",
    description: "Freed up slot for Feb 20 at 8:00 AM",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function activityIcon(type: string) {
  switch (type) {
    case "class_attended":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "class_booked":
      return <CalendarCheck className="h-4 w-4 text-primary" />;
    case "payment_made":
      return <CreditCard className="h-4 w-4 text-secondary" />;
    case "class_cancelled":
      return <XCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
}

// ─── Custom Tooltip for Chart ───────────────────────────────────────────────────

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
        {payload[0].value} workout{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("Member");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState(MOCK_UPCOMING_CLASSES);

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Member";
          setUserName(name);
        }
      } catch {
        // Supabase not configured — keep fallback
      }
    }
    fetchUser();
  }, []);

  const handleCancelClass = (id: string) => {
    setCancellingId(id);
    // Simulate API call
    setTimeout(() => {
      setUpcomingClasses((prev) => prev.filter((c) => c.id !== id));
      setCancellingId(null);
    }, 600);
  };

  // Membership progress
  const today = new Date();
  const totalDays = differenceInDays(MOCK_MEMBERSHIP.endDate, MOCK_MEMBERSHIP.startDate);
  const daysElapsed = differenceInDays(today, MOCK_MEMBERSHIP.startDate);
  const daysRemaining = Math.max(totalDays - daysElapsed, 0);
  const progressPercent = Math.min((daysElapsed / totalDays) * 100, 100);

  return (
    <div className="space-y-8">
      {/* ── Welcome Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back, <span className="text-primary">{userName}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(today, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* ── Quick Stats Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Workouts */}
        <div className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <TrendingUp className="h-3 w-3" />+{MOCK_STATS.workoutChange}
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{MOCK_STATS.totalWorkouts}</p>
          <p className="text-sm text-muted-foreground">Workouts this month</p>
        </div>

        {/* Current Streak */}
        <div className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Flame className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">
            {MOCK_STATS.currentStreak}{" "}
            <span className="text-base font-normal text-muted-foreground">days</span>
          </p>
          <p className="text-sm text-muted-foreground">Current streak</p>
        </div>

        {/* Classes Booked */}
        <div className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{MOCK_STATS.classesBooked}</p>
          <p className="text-sm text-muted-foreground">Classes booked this week</p>
        </div>

        {/* Membership Status */}
        <div className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Crown className="h-5 w-5 text-secondary" />
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              {MOCK_STATS.membershipStatus}
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{MOCK_STATS.membershipPlan}</p>
          <p className="text-sm text-muted-foreground">Membership plan</p>
        </div>
      </div>

      {/* ── Main Grid: Upcoming + Membership ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Classes (takes 2 cols) */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Upcoming Classes</h2>
            <Link
              href="/dashboard/book-class"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Book a class <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <CalendarCheck className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium text-foreground">No upcoming classes</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a class to get started on your fitness journey.
              </p>
              <Link
                href="/dashboard/book-class"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Classes <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:border-border/80"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary/10">
                      <span className="text-xs font-medium text-primary">
                        {format(cls.date, "MMM")}
                      </span>
                      <span className="text-sm font-bold leading-none text-primary">
                        {format(cls.date, "d")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{cls.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {cls.trainer}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {cls.time}
                        </span>
                        <span>{cls.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelClass(cls.id)}
                    disabled={cancellingId === cls.id}
                    className={cn(
                      "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive cursor-pointer",
                      cancellingId === cls.id && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {cancellingId === cls.id ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Membership Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Membership</h2>
            <Link
              href="/dashboard/membership"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Visual card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 p-5">
            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-secondary/5" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {MOCK_MEMBERSHIP.plan} Plan
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  {MOCK_MEMBERSHIP.status}
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-foreground">
                {formatCurrency(MOCK_MEMBERSHIP.pricePerMonth)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Valid until {format(MOCK_MEMBERSHIP.endDate, "MMM d, yyyy")}</span>
                  <span>{daysRemaining} days left</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-background/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Started</span>
              <span className="font-medium text-foreground">
                {format(MOCK_MEMBERSHIP.startDate, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next billing</span>
              <span className="font-medium text-foreground">
                {format(addDays(today, 7), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Chart + Activity Feed ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Activity Chart (takes 2 cols) */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Weekly Activity</h2>
              <p className="text-sm text-muted-foreground">Your workouts this week</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_WEEKLY_ACTIVITY} barCategoryGap="25%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
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
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "rgba(239, 68, 68, 0.05)" }}
                />
                <Bar
                  dataKey="workouts"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {MOCK_RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {activityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/60">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
