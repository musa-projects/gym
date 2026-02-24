"use client";

import { useState, useMemo } from "react";
import {
  Flame,
  Trophy,
  CalendarDays,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Dumbbell,
  Heart,
  Zap,
  Swords,
  Users,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  subDays,
} from "date-fns";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceStatus = "attended" | "no-show" | "cancelled";

interface AttendanceRecord {
  id: string;
  className: string;
  category: string;
  date: Date;
  time: string;
  trainer: string;
  duration: number; // minutes
  status: AttendanceStatus;
}

// ---------------------------------------------------------------------------
// Mock data generator
// ---------------------------------------------------------------------------

const CLASS_OPTIONS = [
  { name: "Inferno HIIT", category: "HIIT", trainer: "Marcus Johnson" },
  { name: "Power Lift", category: "Strength", trainer: "Elena Rodriguez" },
  { name: "Thunderbolt Cardio", category: "Cardio", trainer: "James Carter" },
  { name: "Zen Flow Yoga", category: "Yoga", trainer: "Priya Sharma" },
  { name: "Combat Conditioning", category: "MMA", trainer: "Kai Nakamura" },
  { name: "Iron Circuit", category: "Strength", trainer: "Marcus Johnson" },
  { name: "Pulse Spin", category: "Cardio", trainer: "Tanya Brooks" },
  { name: "Flex & Stretch", category: "Yoga", trainer: "Priya Sharma" },
  { name: "Team Burn", category: "Group", trainer: "James Carter" },
  { name: "Beast Mode", category: "HIIT", trainer: "Elena Rodriguez" },
];

const TIME_SLOTS = [
  "06:00 AM",
  "07:30 AM",
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "05:30 PM",
  "07:00 PM",
  "08:30 PM",
];

const DURATIONS = [30, 45, 45, 60, 60, 60, 75, 90];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMockData(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  let id = 1;

  // Generate data over the last ~60 days
  for (let d = 60; d >= 0; d--) {
    const date = subDays(now, d);
    const dayOfWeek = getDay(date);

    // Skip some days randomly (rest days) - less likely to skip weekdays
    const rand = seededRandom(d * 7 + 1);
    if (dayOfWeek === 0 && rand > 0.3) continue; // Sunday - often rest
    if (rand > 0.75) continue; // Random rest days

    // 1-3 classes per active day
    const classCount = rand < 0.3 ? 1 : rand < 0.7 ? 1 : rand < 0.9 ? 2 : 3;

    for (let c = 0; c < classCount; c++) {
      const classIdx = Math.floor(
        seededRandom(d * 13 + c * 7 + 3) * CLASS_OPTIONS.length
      );
      const timeIdx = Math.floor(
        seededRandom(d * 11 + c * 5 + 9) * TIME_SLOTS.length
      );
      const durIdx = Math.floor(
        seededRandom(d * 17 + c * 3 + 2) * DURATIONS.length
      );

      // Status distribution: ~80% attended, ~10% no-show, ~10% cancelled
      const statusRand = seededRandom(d * 19 + c * 11 + 5);
      let status: AttendanceStatus = "attended";
      if (statusRand > 0.9) status = "no-show";
      else if (statusRand > 0.8) status = "cancelled";

      records.push({
        id: String(id++),
        className: CLASS_OPTIONS[classIdx].name,
        category: CLASS_OPTIONS[classIdx].category,
        date,
        time: TIME_SLOTS[timeIdx],
        trainer: CLASS_OPTIONS[classIdx].trainer,
        duration: DURATIONS[durIdx],
        status,
      });
    }
  }

  return records;
}

const MOCK_RECORDS = generateMockData();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryIcons: Record<string, React.ElementType> = {
  HIIT: Flame,
  Strength: Dumbbell,
  Cardio: Zap,
  Yoga: Heart,
  MMA: Swords,
  Group: Users,
};

const categoryColors: Record<string, string> = {
  HIIT: "bg-red-500/10 text-red-400",
  Strength: "bg-orange-500/10 text-orange-400",
  Cardio: "bg-blue-500/10 text-blue-400",
  Yoga: "bg-emerald-500/10 text-emerald-400",
  MMA: "bg-purple-500/10 text-purple-400",
  Group: "bg-yellow-500/10 text-yellow-400",
};

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  attended: { label: "Attended", className: "bg-green-500/10 text-green-400" },
  "no-show": { label: "No Show", className: "bg-red-500/10 text-red-400" },
  cancelled: {
    label: "Cancelled",
    className: "bg-yellow-500/10 text-yellow-400",
  },
};

function getClassesOnDate(
  records: AttendanceRecord[],
  date: Date
): AttendanceRecord[] {
  return records.filter(
    (r) =>
      r.status === "attended" &&
      format(r.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );
}

function computeStreaks(records: AttendanceRecord[]) {
  const attendedDates = new Set(
    records
      .filter((r) => r.status === "attended")
      .map((r) => format(r.date, "yyyy-MM-dd"))
  );

  const sortedDates = Array.from(attendedDates).sort().reverse();

  // Current streak: count consecutive days from today (or yesterday) backward
  let currentStreak = 0;
  const today = new Date();
  let checkDate = today;

  // Check if today or yesterday was an attendance day to start the streak
  const todayKey = format(today, "yyyy-MM-dd");
  const yesterdayKey = format(subDays(today, 1), "yyyy-MM-dd");

  if (attendedDates.has(todayKey)) {
    currentStreak = 1;
    checkDate = subDays(today, 1);
  } else if (attendedDates.has(yesterdayKey)) {
    currentStreak = 1;
    checkDate = subDays(today, 2);
  } else {
    return { currentStreak: 0, bestStreak: computeBestStreak(sortedDates) };
  }

  while (attendedDates.has(format(checkDate, "yyyy-MM-dd"))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  return {
    currentStreak,
    bestStreak: Math.max(currentStreak, computeBestStreak(sortedDates)),
  };
}

function computeBestStreak(sortedDatesDesc: string[]): number {
  if (sortedDatesDesc.length === 0) return 0;
  const datesAsc = [...sortedDatesDesc].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < datesAsc.length; i++) {
    const prev = new Date(datesAsc[i - 1]);
    const curr = new Date(datesAsc[i]);
    if (differenceInDays(curr, prev) === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  suffix,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            iconColor || "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {suffix && (
          <span className="text-sm font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function CalendarHeatmap({
  records,
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: {
  records: AttendanceRecord[];
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function getHeatColor(count: number, inMonth: boolean): string {
    if (!inMonth) return "bg-muted/10";
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-primary/20";
    if (count === 2) return "bg-primary/40";
    return "bg-primary/70";
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          Attendance Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={onNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {dayHeaders.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const classesOnDay = getClassesOnDate(records, day);
          const count = classesOnDay.length;
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              title={
                inMonth
                  ? `${format(day, "MMM d")} - ${count} class${count !== 1 ? "es" : ""}`
                  : undefined
              }
              className={cn(
                "relative flex h-10 items-center justify-center rounded-lg text-xs font-medium transition-colors sm:h-12",
                getHeatColor(count, inMonth),
                inMonth ? "text-foreground" : "text-muted-foreground/30",
                today && "ring-2 ring-primary ring-offset-1 ring-offset-background"
              )}
            >
              {format(day, "d")}
              {inMonth && count > 0 && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {["bg-muted/30", "bg-primary/20", "bg-primary/40", "bg-primary/70"].map(
            (color, i) => (
              <div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
            )
          )}
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}

function AttendanceHistoryList({
  records,
}: {
  records: AttendanceRecord[];
}) {
  // Show the 20 most recent records
  const sorted = [...records]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20);

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-bold text-foreground">
          Attendance History
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your recent class attendance records
        </p>
      </div>
      <div className="max-h-[540px] overflow-y-auto">
        {sorted.map((record) => {
          const CatIcon = categoryIcons[record.category] || Dumbbell;
          const catColor =
            categoryColors[record.category] || "bg-muted text-foreground";
          const statusCfg = statusConfig[record.status];

          return (
            <div
              key={record.id}
              className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              {/* Category icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  catColor
                )}
              >
                <CatIcon className="h-5 w-5" />
              </div>

              {/* Class info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {record.className}
                  </p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      catColor
                    )}
                  >
                    {record.category}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {format(record.date, "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {record.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {record.trainer}
                  </span>
                  <span>{record.duration} min</span>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  statusCfg.className
                )}
              >
                {statusCfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyBreakdownChart({
  records,
  currentMonth,
}: {
  records: AttendanceRecord[];
  currentMonth: Date;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Build weekly buckets for the current month
  const weeks: { label: string; count: number }[] = [];
  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  let weekNum = 1;

  while (weekStart <= monthEnd) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({
      start: weekStart < monthStart ? monthStart : weekStart,
      end: weekEnd > monthEnd ? monthEnd : weekEnd,
    });

    const count = daysInWeek.reduce(
      (acc, day) => acc + getClassesOnDate(records, day).length,
      0
    );

    weeks.push({
      label: `Week ${weekNum}`,
      count,
    });

    weekStart = addMonths(weekStart, 0); // keep reference
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1);
    weekNum++;
  }

  const maxCount = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold text-foreground">Monthly Breakdown</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Classes per week in {format(currentMonth, "MMMM yyyy")}
      </p>

      <div className="mt-6 space-y-4">
        {weeks.map((week) => {
          const pct = Math.round((week.count / maxCount) * 100);
          return (
            <div key={week.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  {week.label}
                </span>
                <span className="font-bold text-foreground">
                  {week.count} class{week.count !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">
          Total this month
        </span>
        <span className="text-lg font-bold text-primary">
          {weeks.reduce((acc, w) => acc + w.count, 0)} classes
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const records = MOCK_RECORDS;

  const totalAttended = useMemo(
    () => records.filter((r) => r.status === "attended").length,
    [records]
  );

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return records.filter(
      (r) =>
        r.status === "attended" &&
        r.date.getMonth() === now.getMonth() &&
        r.date.getFullYear() === now.getFullYear()
    ).length;
  }, [records]);

  const { currentStreak, bestStreak } = useMemo(
    () => computeStreaks(records),
    [records]
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your gym attendance, streaks, and class history.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Classes Attended"
          value={totalAttended}
          icon={CalendarCheck}
        />
        <StatCard
          label="This Month"
          value={thisMonthCount}
          icon={CalendarDays}
          iconColor="bg-secondary/10 text-secondary"
        />
        <StatCard
          label="Current Streak"
          value={currentStreak}
          icon={Flame}
          iconColor="bg-orange-500/10 text-orange-400"
          suffix="days"
        />
        <StatCard
          label="Best Streak"
          value={bestStreak}
          icon={Trophy}
          iconColor="bg-yellow-500/10 text-yellow-400"
          suffix="days"
        />
      </div>

      {/* Calendar + Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarHeatmap
            records={records}
            currentMonth={currentMonth}
            onPrevMonth={() => setCurrentMonth((m) => subMonths(m, 1))}
            onNextMonth={() => setCurrentMonth((m) => addMonths(m, 1))}
          />
        </div>
        <div className="lg:col-span-1">
          <MonthlyBreakdownChart
            records={records}
            currentMonth={currentMonth}
          />
        </div>
      </div>

      {/* Attendance history */}
      <AttendanceHistoryList records={records} />
    </div>
  );
}
