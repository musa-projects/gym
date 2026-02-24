"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  CalendarDays,
  Clock,
  Users,
  Flame,
  Dumbbell,
  Zap,
  Heart,
  Swords,
  User,
  BarChart3,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClassType {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: string;
  trainer: string;
  maxCapacity: number;
  active: boolean;
  weeklySessions: number;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ScheduleSlot {
  name: string;
  trainer: string;
  duration: number;
}

// ---------------------------------------------------------------------------
// Color map for class types
// ---------------------------------------------------------------------------

const CLASS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  HIIT: { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  Strength: { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  CrossFit: { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  Yoga: { text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
  Boxing: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  "Personal Training": { text: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

const CLASS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HIIT: Flame,
  Strength: Dumbbell,
  CrossFit: Zap,
  Yoga: Heart,
  Boxing: Swords,
  "Personal Training": User,
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CLASSES: ClassType[] = [
  {
    id: "1",
    name: "HIIT",
    category: "Cardio",
    duration: 45,
    difficulty: "Advanced",
    trainer: "Sarah Williams",
    maxCapacity: 25,
    active: true,
    weeklySessions: 7,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    icon: Flame,
  },
  {
    id: "2",
    name: "Strength",
    category: "Resistance",
    duration: 60,
    difficulty: "Intermediate",
    trainer: "Marcus Chen",
    maxCapacity: 20,
    active: true,
    weeklySessions: 6,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    icon: Dumbbell,
  },
  {
    id: "3",
    name: "CrossFit",
    category: "Functional",
    duration: 60,
    difficulty: "Advanced",
    trainer: "Sarah Williams",
    maxCapacity: 20,
    active: true,
    weeklySessions: 5,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    icon: Zap,
  },
  {
    id: "4",
    name: "Yoga",
    category: "Flexibility",
    duration: 60,
    difficulty: "All Levels",
    trainer: "Aisha Patel",
    maxCapacity: 30,
    active: true,
    weeklySessions: 7,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    icon: Heart,
  },
  {
    id: "5",
    name: "Boxing",
    category: "Combat",
    duration: 45,
    difficulty: "Intermediate",
    trainer: "David Rodriguez",
    maxCapacity: 20,
    active: true,
    weeklySessions: 6,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    icon: Swords,
  },
  {
    id: "6",
    name: "Personal Training",
    category: "One-on-One",
    duration: 60,
    difficulty: "All Levels",
    trainer: "All Trainers",
    maxCapacity: 1,
    active: true,
    weeklySessions: 1,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    icon: User,
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["06:00", "08:00", "10:00", "12:00", "17:00", "19:00"];
const TIME_LABELS: Record<string, string> = {
  "06:00": "6:00 AM",
  "08:00": "8:00 AM",
  "09:00": "9:00 AM",
  "10:00": "10:00 AM",
  "11:00": "11:00 AM",
  "12:00": "12:00 PM",
  "14:00": "2:00 PM",
  "17:00": "5:00 PM",
  "19:00": "7:00 PM",
};

// Schedule data matching WEEKLY_SCHEDULE from constants
const SCHEDULE_DATA: Record<string, Record<string, ScheduleSlot>> = {
  Monday: {
    "06:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "08:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "10:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
    "12:00": { name: "Boxing", trainer: "David R.", duration: 45 },
    "17:00": { name: "CrossFit", trainer: "Sarah W.", duration: 60 },
    "19:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
  },
  Tuesday: {
    "06:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
    "08:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "10:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "17:00": { name: "Boxing", trainer: "David R.", duration: 45 },
    "19:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
  },
  Wednesday: {
    "06:00": { name: "CrossFit", trainer: "Sarah W.", duration: 60 },
    "08:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "12:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "17:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
    "19:00": { name: "Boxing", trainer: "David R.", duration: 45 },
  },
  Thursday: {
    "06:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "08:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
    "10:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "17:00": { name: "CrossFit", trainer: "Sarah W.", duration: 60 },
    "19:00": { name: "Boxing", trainer: "David R.", duration: 45 },
  },
  Friday: {
    "06:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
    "08:00": { name: "Boxing", trainer: "David R.", duration: 45 },
    "12:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "17:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "19:00": { name: "CrossFit", trainer: "Sarah W.", duration: 60 },
  },
  Saturday: {
    "08:00": { name: "CrossFit", trainer: "Sarah W.", duration: 60 },
    "10:00": { name: "HIIT", trainer: "Sarah W.", duration: 45 },
    "12:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "14:00": { name: "Boxing", trainer: "David R.", duration: 45 },
  },
  Sunday: {
    "09:00": { name: "Yoga", trainer: "Aisha P.", duration: 60 },
    "11:00": { name: "Strength", trainer: "Marcus C.", duration: 60 },
  },
};

// Collect all unique time slots from the schedule for the table
const ALL_TIME_SLOTS = Array.from(
  new Set([
    ...TIME_SLOTS,
    ...Object.values(SCHEDULE_DATA).flatMap((day) => Object.keys(day)),
  ])
).sort();

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>(MOCK_CLASSES);

  const toggleClassActive = (id: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Count total weekly sessions from schedule data
  const totalWeeklySessions = Object.values(SCHEDULE_DATA).reduce(
    (sum, day) => sum + Object.keys(day).length,
    0
  );

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-tight text-foreground">
            Classes & Schedule
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage class types, schedules, and capacity settings.
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats Summary                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {classes.filter((c) => c.active).length}
              </p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <CalendarDays className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalWeeklySessions}</p>
              <p className="text-sm text-muted-foreground">Weekly Sessions</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">82%</p>
              <p className="text-sm text-muted-foreground">Average Capacity</p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Classes Grid                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Class Types</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const Icon = cls.icon;
            const colors = CLASS_COLORS[cls.name] || CLASS_COLORS.HIIT;
            return (
              <Card key={cls.id} className={cn(!cls.active && "opacity-60")}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          colors.bg
                        )}
                      >
                        <Icon className={cn("h-5 w-5", colors.text)} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cls.name}</CardTitle>
                        <Badge
                          className={cn(
                            "mt-1",
                            colors.bg,
                            colors.text,
                            "text-[10px] px-2 py-0.5"
                          )}
                        >
                          {cls.category}
                        </Badge>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleClassActive(cls.id)}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                      title={cls.active ? "Deactivate" : "Activate"}
                    >
                      {cls.active ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{cls.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>Max {cls.maxCapacity}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Difficulty:</span>{" "}
                      {cls.difficulty}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Trainer:</span>{" "}
                      {cls.trainer}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {cls.weeklySessions} sessions/week
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border-t border-border pt-3">
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <CalendarDays className="h-3.5 w-3.5" />
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Weekly Schedule Table                                             */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Weekly Schedule</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Time
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_TIME_SLOTS.map((time) => (
                    <tr key={time} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {TIME_LABELS[time] || time}
                      </td>
                      {DAYS.map((day) => {
                        const slot = SCHEDULE_DATA[day]?.[time];
                        if (slot) {
                          const colors = CLASS_COLORS[slot.name] || CLASS_COLORS.HIIT;
                          return (
                            <td key={day} className="px-2 py-2">
                              <div
                                className={cn(
                                  "rounded-lg border px-2.5 py-2 text-center transition-colors hover:opacity-80 cursor-pointer",
                                  colors.bg,
                                  colors.border
                                )}
                              >
                                <p className={cn("text-xs font-semibold", colors.text)}>
                                  {slot.name}
                                </p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                  {slot.trainer}
                                </p>
                              </div>
                            </td>
                          );
                        }
                        return (
                          <td key={day} className="px-2 py-2">
                            <button
                              type="button"
                              className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border py-3 text-muted-foreground/40 transition-colors hover:border-primary/30 hover:text-primary/60"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Schedule Legend                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(CLASS_COLORS).map(([name, colors]) => {
          const Icon = CLASS_ICONS[name];
          return (
            <div key={name} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded",
                  colors.bg
                )}
              >
                {Icon && <Icon className={cn("h-3.5 w-3.5", colors.text)} />}
              </div>
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
