"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Target,
  Trophy,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Pencil,
  Flag,
  Flame,
  Star,
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GoalType = "Weight" | "Measurement" | "Performance" | "Habit" | "Custom";
type GoalStatus = "on-track" | "at-risk" | "behind";

interface ActiveGoal {
  id: string;
  title: string;
  type: GoalType;
  currentValue: number;
  targetValue: number;
  startValue: number;
  unit: string;
  targetDate: Date;
  description: string;
  createdAt: Date;
}

interface CompletedGoal {
  id: string;
  title: string;
  type: GoalType;
  completedDate: Date;
}

interface Milestone {
  label: string;
  date: string;
  icon: typeof Star;
}

// ---------------------------------------------------------------------------
// Goal Type Config
// ---------------------------------------------------------------------------

const goalTypeConfig: Record<GoalType, { color: string; bg: string }> = {
  Weight: { color: "text-blue-400", bg: "bg-blue-400/10" },
  Measurement: { color: "text-purple-400", bg: "bg-purple-400/10" },
  Performance: { color: "text-emerald-400", bg: "bg-emerald-400/10" },
  Habit: { color: "text-orange-400", bg: "bg-orange-400/10" },
  Custom: { color: "text-neutral-400", bg: "bg-neutral-400/10" },
};

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const initialActiveGoals: ActiveGoal[] = [
  {
    id: "1",
    title: "Reach 80kg",
    type: "Weight",
    currentValue: 82.5,
    targetValue: 80,
    startValue: 85,
    unit: "kg",
    targetDate: new Date(2026, 3, 15),
    description: "Reduce body weight to 80kg through consistent training and nutrition.",
    createdAt: new Date(2025, 11, 1),
  },
  {
    id: "2",
    title: "Run 5K in 25min",
    type: "Performance",
    currentValue: 29,
    targetValue: 25,
    startValue: 32,
    unit: "min",
    targetDate: new Date(2026, 2, 30),
    description: "Improve 5K running time to under 25 minutes.",
    createdAt: new Date(2025, 10, 15),
  },
  {
    id: "3",
    title: "10 Pull-ups",
    type: "Performance",
    currentValue: 6,
    targetValue: 10,
    startValue: 3,
    unit: "reps",
    targetDate: new Date(2026, 4, 1),
    description: "Achieve 10 consecutive pull-ups with proper form.",
    createdAt: new Date(2025, 11, 10),
  },
  {
    id: "4",
    title: "30-Day Gym Streak",
    type: "Habit",
    currentValue: 18,
    targetValue: 30,
    startValue: 0,
    unit: "days",
    targetDate: new Date(2026, 2, 10),
    description: "Visit the gym every single day for 30 consecutive days.",
    createdAt: new Date(2026, 1, 8),
  },
];

const initialCompletedGoals: CompletedGoal[] = [
  {
    id: "c1",
    title: "Lose 5kg",
    type: "Weight",
    completedDate: new Date(2026, 0, 22),
  },
  {
    id: "c2",
    title: "Touch Toes",
    type: "Measurement",
    completedDate: new Date(2025, 11, 14),
  },
  {
    id: "c3",
    title: "Bench Press 100kg",
    type: "Performance",
    completedDate: new Date(2025, 10, 8),
  },
];

const milestones: Milestone[] = [
  { label: "Set first goal", date: "Oct 2025", icon: Flag },
  { label: "Completed first goal", date: "Nov 2025", icon: Trophy },
  { label: "3 goals completed", date: "Jan 2026", icon: Star },
  { label: "5 goals completed", date: "Feb 2026", icon: Flame },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeProgress(goal: ActiveGoal): number {
  const range = Math.abs(goal.startValue - goal.targetValue);
  if (range === 0) return 100;
  const done = Math.abs(goal.startValue - goal.currentValue);
  return Math.min(100, Math.round((done / range) * 100));
}

function computeStatus(goal: ActiveGoal): GoalStatus {
  const pct = computeProgress(goal);
  if (isPast(goal.targetDate)) return "behind";
  const daysLeft = differenceInDays(goal.targetDate, new Date());
  if (daysLeft < 30 && pct < 70) return "at-risk";
  return "on-track";
}

const statusConfig = {
  "on-track": {
    label: "On Track",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: CheckCircle2,
  },
  "at-risk": {
    label: "At Risk",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: AlertTriangle,
  },
  behind: {
    label: "Behind",
    color: "text-red-400",
    bg: "bg-red-400/10",
    icon: XCircle,
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GoalsPage() {
  const [activeGoals, setActiveGoals] = useState<ActiveGoal[]>(initialActiveGoals);
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>(initialCompletedGoals);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);
  const [updateValue, setUpdateValue] = useState("");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<GoalType>("Weight");
  const [formTarget, setFormTarget] = useState("");
  const [formUnit, setFormUnit] = useState("kg");
  const [formCurrent, setFormCurrent] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function handleCreateGoal() {
    if (!formTitle || !formTarget || !formCurrent || !formDate) return;
    const newGoal: ActiveGoal = {
      id: `new-${Date.now()}`,
      title: formTitle,
      type: formType,
      currentValue: parseFloat(formCurrent),
      targetValue: parseFloat(formTarget),
      startValue: parseFloat(formCurrent),
      unit: formUnit,
      targetDate: new Date(formDate),
      description: formDescription,
      createdAt: new Date(),
    };
    setActiveGoals((prev) => [newGoal, ...prev]);
    setFormTitle("");
    setFormType("Weight");
    setFormTarget("");
    setFormUnit("kg");
    setFormCurrent("");
    setFormDate("");
    setFormDescription("");
    setShowCreateForm(false);
  }

  function handleUpdateProgress(goalId: string) {
    const val = parseFloat(updateValue);
    if (isNaN(val)) return;
    setActiveGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentValue: val } : g))
    );
    setUpdatingGoalId(null);
    setUpdateValue("");
  }

  function handleCompleteGoal(goalId: string) {
    const goal = activeGoals.find((g) => g.id === goalId);
    if (!goal) return;
    setActiveGoals((prev) => prev.filter((g) => g.id !== goalId));
    setCompletedGoals((prev) => [
      {
        id: goal.id,
        title: goal.title,
        type: goal.type,
        completedDate: new Date(),
      },
      ...prev,
    ]);
  }

  function handleAbandonGoal(goalId: string) {
    setActiveGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const activeCount = activeGoals.length;
  const completedCount = completedGoals.length;
  const totalGoals = activeCount + completedCount;
  const successRate = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/progress"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-[var(--font-oswald)] text-2xl font-bold tracking-tight text-foreground">
              My Goals
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Set targets, track progress, and celebrate achievements.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4" />
          Create Goal
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Goals Summary                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Active Goals",
            value: activeCount,
            icon: Target,
            accent: "text-primary",
            accentBg: "bg-primary/10",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: Trophy,
            accent: "text-emerald-400",
            accentBg: "bg-emerald-400/10",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            icon: TrendingUp,
            accent: "text-secondary",
            accentBg: "bg-secondary/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    stat.accentBg
                  )}
                >
                  <Icon className={cn("h-6 w-6", stat.accent)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Create Goal Form (Collapsible)                                    */}
      {/* ----------------------------------------------------------------- */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-primary" />
              New Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bench Press 120kg"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Goal Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Goal Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as GoalType)}
                  className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {(["Weight", "Measurement", "Performance", "Habit", "Custom"] as GoalType[]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Target Value */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Target Value
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="80"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-24 shrink-0 rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {["kg", "lbs", "cm", "in", "reps", "minutes", "days", "%"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Value */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Current Value
                </label>
                <input
                  type="number"
                  placeholder="85"
                  value={formCurrent}
                  onChange={(e) => setFormCurrent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your goal and how you plan to achieve it..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full resize-none rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2">
                <Button variant="primary" size="sm" onClick={handleCreateGoal}>
                  <Plus className="h-4 w-4" />
                  Create Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Active Goals                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h3 className="mb-4 font-[var(--font-oswald)] text-lg font-semibold tracking-tight text-foreground">
          Active Goals
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {activeGoals.map((goal) => {
            const pct = computeProgress(goal);
            const status = computeStatus(goal);
            const statusInfo = statusConfig[status];
            const StatusIcon = statusInfo.icon;
            const typeConf = goalTypeConfig[goal.type];
            const daysLeft = differenceInDays(goal.targetDate, new Date());
            const pastDue = isPast(goal.targetDate);
            const isUpdating = updatingGoalId === goal.id;

            // Determine progress bar color based on status
            const barColor =
              status === "on-track"
                ? "bg-emerald-500"
                : status === "at-risk"
                  ? "bg-amber-500"
                  : "bg-red-500";

            return (
              <Card key={goal.id}>
                <CardContent className="p-5">
                  {/* Top row: title + type badge + status */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          typeConf.bg
                        )}
                      >
                        <Target className={cn("h-4 w-4", typeConf.color)} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {goal.title}
                        </h4>
                        <Badge
                          className={cn(
                            "mt-0.5 px-2 py-0.5 text-[10px]",
                            typeConf.bg,
                            typeConf.color
                          )}
                        >
                          {goal.type}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                        statusInfo.bg,
                        statusInfo.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {goal.currentValue} {goal.unit} &rarr; {goal.targetValue} {goal.unit}
                      </span>
                      <span className="font-semibold text-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", barColor)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Target date */}
                  <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Target: {format(goal.targetDate, "MMM d, yyyy")}</span>
                    <span className="mx-1 text-border">|</span>
                    <Clock className="h-3 w-3" />
                    {pastDue ? (
                      <span className="font-medium text-red-400">Past due</span>
                    ) : (
                      <span>
                        {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
                      </span>
                    )}
                  </div>

                  {/* Inline update input */}
                  {isUpdating && (
                    <div className="mb-3 flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        placeholder={`Current: ${goal.currentValue}`}
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                        autoFocus
                        className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="shrink-0 text-xs text-muted-foreground">{goal.unit}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateProgress(goal.id)}
                        className="shrink-0"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUpdatingGoalId(null);
                          setUpdateValue("");
                        }}
                        className="shrink-0"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!isUpdating && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUpdatingGoalId(goal.id);
                          setUpdateValue(String(goal.currentValue));
                        }}
                        className="text-xs"
                      >
                        <Pencil className="h-3 w-3" />
                        Update Progress
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCompleteGoal(goal.id)}
                      className="text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAbandonGoal(goal.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Abandon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeGoals.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
              <Target className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No active goals yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Completed Goals (Collapsible)                                     */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-400" />
            <span className="font-[var(--font-oswald)] text-lg font-semibold tracking-tight text-foreground">
              Completed Goals
            </span>
            <Badge variant="success" className="ml-1">
              {completedGoals.length}
            </Badge>
          </div>
          {showCompleted ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {showCompleted && (
          <div className="space-y-3">
            {completedGoals.map((goal) => {
              const typeConf = goalTypeConfig[goal.type];
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        typeConf.bg
                      )}
                    >
                      <CheckCircle2 className={cn("h-4 w-4", typeConf.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground line-through">
                        {goal.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge
                          className={cn(
                            "px-2 py-0.5 text-[10px]",
                            typeConf.bg,
                            typeConf.color
                          )}
                        >
                          {goal.type}
                        </Badge>
                        <Badge variant="success" className="px-2 py-0.5 text-[10px]">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(goal.completedDate, "MMM yyyy")}
                  </span>
                </div>
              );
            })}

            {completedGoals.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No completed goals yet. Keep working towards your targets!
              </p>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Milestones Timeline                                               */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flag className="h-5 w-5 text-secondary" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative ml-3">
            {/* Vertical connecting line */}
            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-border" />

            <div className="space-y-6">
              {milestones.map((milestone, i) => {
                const MIcon = milestone.icon;
                // Alternate accent colors for the dots
                const dotColors = [
                  "bg-primary border-primary/30",
                  "bg-emerald-500 border-emerald-500/30",
                  "bg-secondary border-secondary/30",
                  "bg-blue-500 border-blue-500/30",
                ];
                const dotColor = dotColors[i % dotColors.length];

                return (
                  <div key={milestone.label} className="relative flex items-start gap-4 pl-6">
                    {/* Dot */}
                    <div
                      className={cn(
                        "absolute left-0 top-0.5 h-[15px] w-[15px] rounded-full border-2",
                        dotColor
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {milestone.label}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MIcon className="h-3 w-3" />
                        {milestone.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
