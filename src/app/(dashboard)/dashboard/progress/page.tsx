"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingDown,
  TrendingUp,
  Scale,
  Percent,
  Dumbbell,
  Activity,
  Flame,
  CalendarCheck,
  Trophy,
  Lock,
  Target,
  Timer,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const bodyStats = [
  {
    label: "Weight",
    value: "82.5",
    unit: "kg",
    change: -2.3,
    icon: Scale,
  },
  {
    label: "Body Fat",
    value: "18.2",
    unit: "%",
    change: -1.5,
    icon: Percent,
  },
  {
    label: "Muscle Mass",
    value: "38.1",
    unit: "kg",
    change: 1.2,
    icon: Dumbbell,
  },
  {
    label: "BMI",
    value: "24.8",
    unit: "",
    change: 0,
    icon: Activity,
  },
];

const weightData = [
  { date: "Dec 1", weight: 84.8 },
  { date: "Dec 8", weight: 84.5 },
  { date: "Dec 15", weight: 84.2 },
  { date: "Dec 22", weight: 83.9 },
  { date: "Dec 29", weight: 83.7 },
  { date: "Jan 5", weight: 83.5 },
  { date: "Jan 12", weight: 83.2 },
  { date: "Jan 19", weight: 83.0 },
  { date: "Jan 26", weight: 83.1 },
  { date: "Feb 2", weight: 82.8 },
  { date: "Feb 9", weight: 82.6 },
  { date: "Feb 16", weight: 82.5 },
  { date: "Feb 23", weight: 82.5 },
];

const measurements = [
  { part: "Chest", current: 102, previous: 100.5, unit: "cm" },
  { part: "Waist", current: 84, previous: 86, unit: "cm" },
  { part: "Hips", current: 98, previous: 99, unit: "cm" },
  { part: "Arms", current: 36, previous: 35, unit: "cm" },
  { part: "Thighs", current: 58, previous: 57.5, unit: "cm" },
];

const goals = [
  {
    name: "Reach 80kg",
    current: 82.5,
    target: 80,
    start: 85,
    targetDate: "Apr 30, 2026",
    status: "on-track" as const,
  },
  {
    name: "Run 5K in 25min",
    current: 27,
    target: 25,
    start: 32,
    targetDate: "Mar 31, 2026",
    status: "at-risk" as const,
  },
  {
    name: "10 Pull-ups",
    current: 7,
    target: 10,
    start: 3,
    targetDate: "May 15, 2026",
    status: "on-track" as const,
  },
];

const achievements = [
  {
    name: "7-Day Streak",
    icon: Flame,
    unlocked: true,
    date: "Jan 12, 2026",
  },
  {
    name: "First Month",
    icon: CalendarCheck,
    unlocked: true,
    date: "Jan 28, 2026",
  },
  {
    name: "50 Classes",
    icon: Trophy,
    unlocked: false,
    date: null,
  },
  {
    name: "100 Classes",
    icon: Trophy,
    unlocked: false,
    date: null,
  },
];

// ---------------------------------------------------------------------------
// Custom Tooltip for Recharts
// ---------------------------------------------------------------------------

function CustomTooltip({
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
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {payload[0].value} kg
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function goalProgress(goal: (typeof goals)[number]) {
  const range = Math.abs(goal.start - goal.target);
  const done = Math.abs(goal.start - goal.current);
  return Math.min(100, Math.round((done / range) * 100));
}

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  const isPositive = value > 0;
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive ? "text-emerald-500" : "text-emerald-500"
      )}
    >
      {isPositive ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      {isPositive ? "+" : ""}
      {value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<"3m" | "6m" | "1y">("3m");

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Progress Tracking</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your fitness journey and celebrate your milestones.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/progress/measurements"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Scale className="h-4 w-4" />
            Measurements
          </Link>
          <Link
            href="/dashboard/progress/photos"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Activity className="h-4 w-4" />
            Photos
          </Link>
          <Link
            href="/dashboard/progress/goals"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Target className="h-4 w-4" />
            Goals
          </Link>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Body Stats Summary                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bodyStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {stat.change !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      stat.change < 0
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    )}
                  >
                    {stat.change < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {stat.change > 0 ? "+" : ""}
                    {stat.change}
                    {stat.unit}
                  </div>
                )}
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {stat.value}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {stat.unit}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Weight Progress Chart                                             */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Weight Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              Tracking your weight over the last 3 months
            </p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["3m", "6m", "1y"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weightData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
                axisLine={{ stroke: "#262626" }}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#262626" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#ef4444", stroke: "#111111", strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  fill: "#ef4444",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Body Measurements + Goals                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Measurements */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Body Measurements
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-medium">Body Part</th>
                  <th className="pb-3 font-medium">Current</th>
                  <th className="pb-3 font-medium">Previous</th>
                  <th className="pb-3 text-right font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {measurements.map((m) => {
                  const diff = +(m.current - m.previous).toFixed(1);
                  return (
                    <tr key={m.part}>
                      <td className="py-3 font-medium text-foreground">
                        {m.part}
                      </td>
                      <td className="py-3 text-foreground">
                        {m.current} {m.unit}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {m.previous} {m.unit}
                      </td>
                      <td className="py-3 text-right">
                        <ChangeIndicator value={diff} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goals */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Goals</h3>
          <div className="space-y-5">
            {goals.map((goal) => {
              const pct = goalProgress(goal);
              return (
                <div key={goal.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {goal.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        goal.status === "on-track"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      )}
                    >
                      {goal.status === "on-track" ? "On Track" : "At Risk"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        goal.status === "on-track"
                          ? "bg-primary"
                          : "bg-amber-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pct}% complete</span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {goal.targetDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Achievements                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {achievements.map((a) => {
            const Icon = a.unlocked ? a.icon : Lock;
            return (
              <div
                key={a.name}
                className={cn(
                  "flex flex-col items-center rounded-xl border p-5 text-center transition-colors",
                  a.unlocked
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/50 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex h-12 w-12 items-center justify-center rounded-full",
                    a.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    a.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {a.name}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {a.unlocked ? a.date : "Locked"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
