"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Flame,
  Dumbbell,
  Zap,
  Heart,
  Swords,
  UserCheck,
  Activity,
  CalendarOff,
} from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
  getDay,
} from "date-fns";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category =
  | "hiit"
  | "strength"
  | "crossfit"
  | "yoga"
  | "boxing"
  | "personal_training"
  | "cardio";

type Difficulty = "beginner" | "intermediate" | "advanced" | "all_levels";

type BookingStatus = "confirmed" | "waitlisted" | "cancelled" | "attended" | "no_show";

interface MockClassSession {
  id: string;
  className: string;
  category: Category;
  slug: string;
  trainerName: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  durationMinutes: number;
  difficulty: Difficulty;
  maxCapacity: number;
  currentBookings: number;
  location: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  bookingStatus: BookingStatus | null; // null = not booked
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; bg: string; dot: string; icon: React.ElementType }
> = {
  hiit: { label: "HIIT", color: "text-red-500", bg: "bg-red-500/10", dot: "bg-red-500", icon: Flame },
  strength: { label: "Strength", color: "text-orange-500", bg: "bg-orange-500/10", dot: "bg-orange-500", icon: Dumbbell },
  crossfit: { label: "CrossFit", color: "text-yellow-500", bg: "bg-yellow-500/10", dot: "bg-yellow-500", icon: Zap },
  yoga: { label: "Yoga", color: "text-green-500", bg: "bg-green-500/10", dot: "bg-green-500", icon: Heart },
  boxing: { label: "Boxing", color: "text-blue-500", bg: "bg-blue-500/10", dot: "bg-blue-500", icon: Swords },
  personal_training: { label: "Personal Training", color: "text-purple-500", bg: "bg-purple-500/10", dot: "bg-purple-500", icon: UserCheck },
  cardio: { label: "Cardio", color: "text-pink-500", bg: "bg-pink-500/10", dot: "bg-pink-500", icon: Activity },
};

const FILTER_CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hiit", label: "HIIT" },
  { value: "strength", label: "Strength" },
  { value: "crossfit", label: "CrossFit" },
  { value: "yoga", label: "Yoga" },
  { value: "boxing", label: "Boxing" },
  { value: "personal_training", label: "Personal Training" },
];

// ---------------------------------------------------------------------------
// Difficulty config
// ---------------------------------------------------------------------------

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "text-green-400", bg: "bg-green-500/10" },
  intermediate: { label: "Intermediate", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  advanced: { label: "Advanced", color: "text-red-400", bg: "bg-red-500/10" },
  all_levels: { label: "All Levels", color: "text-blue-400", bg: "bg-blue-500/10" },
};

// ---------------------------------------------------------------------------
// Mock data - realistic week of classes
// ---------------------------------------------------------------------------

const MOCK_SESSIONS: MockClassSession[] = [
  // Monday (1)
  { id: "s1", className: "Morning HIIT Blast", category: "hiit", slug: "hiit", trainerName: "Sarah Williams", startTime: "06:00", endTime: "06:45", durationMinutes: 45, difficulty: "advanced", maxCapacity: 20, currentBookings: 18, location: "Studio A", dayOfWeek: 1, bookingStatus: null },
  { id: "s2", className: "Sunrise Yoga Flow", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "07:00", endTime: "08:00", durationMinutes: 60, difficulty: "all_levels", maxCapacity: 25, currentBookings: 12, location: "Studio B", dayOfWeek: 1, bookingStatus: "confirmed" },
  { id: "s3", className: "Strength Fundamentals", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "09:00", endTime: "10:00", durationMinutes: 60, difficulty: "beginner", maxCapacity: 15, currentBookings: 8, location: "Weight Room", dayOfWeek: 1, bookingStatus: null },
  { id: "s4", className: "Boxing Basics", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "12:00", endTime: "12:45", durationMinutes: 45, difficulty: "beginner", maxCapacity: 16, currentBookings: 16, location: "Boxing Ring", dayOfWeek: 1, bookingStatus: null },
  { id: "s5", className: "CrossFit WOD", category: "crossfit", slug: "crossfit", trainerName: "Sarah Williams", startTime: "17:00", endTime: "18:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 20, currentBookings: 15, location: "CrossFit Box", dayOfWeek: 1, bookingStatus: null },
  { id: "s6", className: "Evening HIIT", category: "hiit", slug: "hiit", trainerName: "Nina Kowalski", startTime: "19:00", endTime: "19:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 20, currentBookings: 20, location: "Studio A", dayOfWeek: 1, bookingStatus: "waitlisted" },

  // Tuesday (2)
  { id: "s7", className: "Power Lifting", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "06:00", endTime: "07:00", durationMinutes: 60, difficulty: "advanced", maxCapacity: 12, currentBookings: 10, location: "Weight Room", dayOfWeek: 2, bookingStatus: null },
  { id: "s8", className: "Cardio Kickstart", category: "cardio", slug: "cardio", trainerName: "Nina Kowalski", startTime: "08:00", endTime: "08:45", durationMinutes: 45, difficulty: "all_levels", maxCapacity: 30, currentBookings: 14, location: "Studio A", dayOfWeek: 2, bookingStatus: null },
  { id: "s9", className: "Restorative Yoga", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "10:00", endTime: "11:00", durationMinutes: 60, difficulty: "beginner", maxCapacity: 20, currentBookings: 6, location: "Studio B", dayOfWeek: 2, bookingStatus: null },
  { id: "s10", className: "Boxing Conditioning", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "17:00", endTime: "17:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 16, currentBookings: 13, location: "Boxing Ring", dayOfWeek: 2, bookingStatus: null },
  { id: "s11", className: "Hypertrophy Training", category: "strength", slug: "strength", trainerName: "Jake Morrison", startTime: "19:00", endTime: "20:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 15, currentBookings: 15, location: "Weight Room", dayOfWeek: 2, bookingStatus: null },

  // Wednesday (3)
  { id: "s12", className: "CrossFit Endurance", category: "crossfit", slug: "crossfit", trainerName: "Sarah Williams", startTime: "06:00", endTime: "07:00", durationMinutes: 60, difficulty: "advanced", maxCapacity: 18, currentBookings: 16, location: "CrossFit Box", dayOfWeek: 3, bookingStatus: null },
  { id: "s13", className: "Vinyasa Yoga", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "08:00", endTime: "09:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 25, currentBookings: 18, location: "Studio B", dayOfWeek: 3, bookingStatus: "confirmed" },
  { id: "s14", className: "Lunchtime HIIT", category: "hiit", slug: "hiit", trainerName: "Sarah Williams", startTime: "12:00", endTime: "12:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 20, currentBookings: 11, location: "Studio A", dayOfWeek: 3, bookingStatus: null },
  { id: "s15", className: "Strength & Power", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "17:00", endTime: "18:00", durationMinutes: 60, difficulty: "advanced", maxCapacity: 12, currentBookings: 9, location: "Weight Room", dayOfWeek: 3, bookingStatus: null },
  { id: "s16", className: "Boxing Sparring", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "19:00", endTime: "19:45", durationMinutes: 45, difficulty: "advanced", maxCapacity: 12, currentBookings: 12, location: "Boxing Ring", dayOfWeek: 3, bookingStatus: null },

  // Thursday (4)
  { id: "s17", className: "Tabata HIIT", category: "hiit", slug: "hiit", trainerName: "Nina Kowalski", startTime: "06:00", endTime: "06:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 20, currentBookings: 14, location: "Studio A", dayOfWeek: 4, bookingStatus: null },
  { id: "s18", className: "Barbell Strength", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "08:00", endTime: "09:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 15, currentBookings: 11, location: "Weight Room", dayOfWeek: 4, bookingStatus: null },
  { id: "s19", className: "Power Yoga", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "10:00", endTime: "11:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 25, currentBookings: 19, location: "Studio B", dayOfWeek: 4, bookingStatus: null },
  { id: "s20", className: "Personal Training", category: "personal_training", slug: "personal-training", trainerName: "Jake Morrison", startTime: "14:00", endTime: "15:00", durationMinutes: 60, difficulty: "all_levels", maxCapacity: 1, currentBookings: 0, location: "Training Suite", dayOfWeek: 4, bookingStatus: null },
  { id: "s21", className: "CrossFit Strength", category: "crossfit", slug: "crossfit", trainerName: "Sarah Williams", startTime: "17:00", endTime: "18:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 20, currentBookings: 17, location: "CrossFit Box", dayOfWeek: 4, bookingStatus: null },
  { id: "s22", className: "Fight Night Boxing", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "19:00", endTime: "19:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 16, currentBookings: 14, location: "Boxing Ring", dayOfWeek: 4, bookingStatus: null },

  // Friday (5)
  { id: "s23", className: "Olympic Lifting", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "06:00", endTime: "07:00", durationMinutes: 60, difficulty: "advanced", maxCapacity: 10, currentBookings: 8, location: "Weight Room", dayOfWeek: 5, bookingStatus: null },
  { id: "s24", className: "Boxing Fundamentals", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "08:00", endTime: "08:45", durationMinutes: 45, difficulty: "beginner", maxCapacity: 16, currentBookings: 5, location: "Boxing Ring", dayOfWeek: 5, bookingStatus: null },
  { id: "s25", className: "Friday HIIT Burn", category: "hiit", slug: "hiit", trainerName: "Sarah Williams", startTime: "12:00", endTime: "12:45", durationMinutes: 45, difficulty: "advanced", maxCapacity: 20, currentBookings: 19, location: "Studio A", dayOfWeek: 5, bookingStatus: "confirmed" },
  { id: "s26", className: "Yin Yoga", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "17:00", endTime: "18:00", durationMinutes: 60, difficulty: "beginner", maxCapacity: 25, currentBookings: 10, location: "Studio B", dayOfWeek: 5, bookingStatus: null },
  { id: "s27", className: "CrossFit Friday", category: "crossfit", slug: "crossfit", trainerName: "Jake Morrison", startTime: "19:00", endTime: "20:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 20, currentBookings: 20, location: "CrossFit Box", dayOfWeek: 5, bookingStatus: null },

  // Saturday (6)
  { id: "s28", className: "Weekend CrossFit", category: "crossfit", slug: "crossfit", trainerName: "Sarah Williams", startTime: "08:00", endTime: "09:00", durationMinutes: 60, difficulty: "all_levels", maxCapacity: 24, currentBookings: 20, location: "CrossFit Box", dayOfWeek: 6, bookingStatus: null },
  { id: "s29", className: "Saturday HIIT Party", category: "hiit", slug: "hiit", trainerName: "Nina Kowalski", startTime: "10:00", endTime: "10:45", durationMinutes: 45, difficulty: "intermediate", maxCapacity: 25, currentBookings: 22, location: "Studio A", dayOfWeek: 6, bookingStatus: null },
  { id: "s30", className: "Cardio Dance", category: "cardio", slug: "cardio", trainerName: "Nina Kowalski", startTime: "11:00", endTime: "11:45", durationMinutes: 45, difficulty: "all_levels", maxCapacity: 30, currentBookings: 16, location: "Studio A", dayOfWeek: 6, bookingStatus: null },
  { id: "s31", className: "Weekend Yoga", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "12:00", endTime: "13:00", durationMinutes: 60, difficulty: "all_levels", maxCapacity: 25, currentBookings: 14, location: "Studio B", dayOfWeek: 6, bookingStatus: null },
  { id: "s32", className: "Boxing Open Gym", category: "boxing", slug: "boxing", trainerName: "David Rodriguez", startTime: "14:00", endTime: "14:45", durationMinutes: 45, difficulty: "all_levels", maxCapacity: 20, currentBookings: 9, location: "Boxing Ring", dayOfWeek: 6, bookingStatus: null },

  // Sunday (7)
  { id: "s33", className: "Sunday Slow Flow", category: "yoga", slug: "yoga", trainerName: "Aisha Patel", startTime: "09:00", endTime: "10:00", durationMinutes: 60, difficulty: "beginner", maxCapacity: 25, currentBookings: 8, location: "Studio B", dayOfWeek: 7, bookingStatus: null },
  { id: "s34", className: "Sunday Strength", category: "strength", slug: "strength", trainerName: "Marcus Chen", startTime: "11:00", endTime: "12:00", durationMinutes: 60, difficulty: "intermediate", maxCapacity: 15, currentBookings: 7, location: "Weight Room", dayOfWeek: 7, bookingStatus: null },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

/** Convert JS Date getDay() (0=Sun) to our dayOfWeek (1=Mon ... 7=Sun) */
function dateToDayOfWeek(date: Date): number {
  const jsDay = getDay(date); // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BookClassPage() {
  const today = new Date();

  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [sessions, setSessions] = useState<MockClassSession[]>(MOCK_SESSIONS);

  // Build array of 7 days for the current week (Mon-Sun)
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Filter sessions for the selected date and category
  const filteredSessions = useMemo(() => {
    const dow = dateToDayOfWeek(selectedDate);
    return sessions
      .filter((s) => s.dayOfWeek === dow)
      .filter((s) => activeCategory === "all" || s.category === activeCategory)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, activeCategory, sessions]);

  // Handlers
  const prevWeek = () => {
    const newStart = subWeeks(weekStart, 1);
    setWeekStart(newStart);
    setSelectedDate(addDays(newStart, dateToDayOfWeek(selectedDate) - 1));
  };

  const nextWeek = () => {
    const newStart = addWeeks(weekStart, 1);
    setWeekStart(newStart);
    setSelectedDate(addDays(newStart, dateToDayOfWeek(selectedDate) - 1));
  };

  const handleBook = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        if (s.currentBookings >= s.maxCapacity) {
          return { ...s, bookingStatus: "waitlisted" };
        }
        return {
          ...s,
          bookingStatus: "confirmed",
          currentBookings: s.currentBookings + 1,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Date Navigation */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        {/* Week header row */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevWeek}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {format(weekDays[0], "MMM d")} &ndash; {format(weekDays[6], "MMM d, yyyy")}
          </h2>
          <button
            onClick={nextWeek}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center transition-all sm:gap-1 sm:px-3 sm:py-3",
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : isTodayDate
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span className="text-[10px] font-medium uppercase sm:text-xs">
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "text-base font-bold sm:text-lg",
                    isSelected && "text-white"
                  )}
                >
                  {format(day, "d")}
                </span>
                {isTodayDate && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Category Filter */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          const config = cat.value !== "all" ? CATEGORY_CONFIG[cat.value] : null;

          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {config && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isActive ? "bg-white" : config.dot
                  )}
                />
              )}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Classes Grid or Empty State */}
      {/* ----------------------------------------------------------------- */}
      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <CalendarOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Classes Available</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            There are no{" "}
            {activeCategory !== "all"
              ? CATEGORY_CONFIG[activeCategory].label + " "
              : ""}
            classes scheduled for{" "}
            {isToday(selectedDate)
              ? "today"
              : format(selectedDate, "EEEE, MMM d")}
            . Try selecting a different day or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSessions.map((session) => {
            const catConfig = CATEGORY_CONFIG[session.category];
            const diffConfig = DIFFICULTY_CONFIG[session.difficulty];
            const isFull = session.currentBookings >= session.maxCapacity;
            const isBooked = session.bookingStatus === "confirmed";
            const isWaitlisted = session.bookingStatus === "waitlisted";
            const capacityPercent = Math.min(
              (session.currentBookings / session.maxCapacity) * 100,
              100
            );

            return (
              <div
                key={session.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Category color bar */}
                <div className={cn("h-1", catConfig.bg)} />

                <div className="p-5">
                  {/* Header: name + category badge */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {session.className}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                        catConfig.bg,
                        catConfig.color
                      )}
                    >
                      <catConfig.icon className="h-3 w-3" />
                      {catConfig.label}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatTime(session.startTime)} &ndash;{" "}
                      {formatTime(session.endTime)}
                    </span>
                    <span className="text-muted-foreground">
                      ({session.durationMinutes} min)
                    </span>
                  </div>

                  {/* Trainer + Location */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {session.trainerName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {session.location}
                    </span>
                  </div>

                  {/* Difficulty badge */}
                  <div className="mb-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        diffConfig.bg,
                        diffConfig.color
                      )}
                    >
                      {diffConfig.label}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {session.currentBookings}/{session.maxCapacity} spots
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          isFull ? "text-red-400" : capacityPercent >= 80 ? "text-yellow-400" : "text-green-400"
                        )}
                      >
                        {isFull
                          ? "Full"
                          : `${session.maxCapacity - session.currentBookings} left`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isFull
                            ? "bg-red-500"
                            : capacityPercent >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        )}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  {isBooked ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-500 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Booked
                    </button>
                  ) : isWaitlisted ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2.5 text-sm font-semibold text-yellow-500 transition-colors"
                    >
                      <Clock className="h-4 w-4" />
                      On Waitlist
                    </button>
                  ) : isFull ? (
                    <button
                      onClick={() => handleBook(session.id)}
                      className="w-full rounded-lg border-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBook(session.id)}
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-red-600 hover:shadow-primary/40"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
