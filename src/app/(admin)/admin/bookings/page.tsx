"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Search,
  ChevronDown,
  UserCheck,
  CalendarDays,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BookingStatus = "confirmed" | "attended" | "no_show" | "cancelled" | "waitlisted";
type ClassType = "HIIT" | "Strength" | "CrossFit" | "Yoga" | "Boxing";

interface Booking {
  id: string;
  time: string;
  class_name: string;
  class_type: ClassType;
  member_name: string;
  trainer: string;
  status: BookingStatus;
}

interface ScheduleClass {
  id: string;
  time: string;
  name: string;
  trainer: string;
  booked: number;
  capacity: number;
  type: ClassType;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; dot: string }> = {
  confirmed: { label: "Confirmed", color: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-500" },
  attended: { label: "Attended", color: "text-green-400", bg: "bg-green-500/10", dot: "bg-green-500" },
  no_show: { label: "No Show", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-500" },
  cancelled: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-500/10", dot: "bg-gray-500" },
  waitlisted: { label: "Waitlisted", color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-500" },
};

// ---------------------------------------------------------------------------
// Mock data — 20 bookings
// ---------------------------------------------------------------------------

const MOCK_BOOKINGS: Booking[] = [
  { id: "bk_01", time: "06:00 AM", class_name: "HIIT Blast", class_type: "HIIT", member_name: "James Wilson", trainer: "Marcus Cole", status: "attended" },
  { id: "bk_02", time: "06:00 AM", class_name: "HIIT Blast", class_type: "HIIT", member_name: "Maria Garcia", trainer: "Marcus Cole", status: "attended" },
  { id: "bk_03", time: "06:00 AM", class_name: "HIIT Blast", class_type: "HIIT", member_name: "Tyler Brooks", trainer: "Marcus Cole", status: "no_show" },
  { id: "bk_04", time: "07:00 AM", class_name: "Power Yoga", class_type: "Yoga", member_name: "Ashley Chen", trainer: "Sarah Chen", status: "attended" },
  { id: "bk_05", time: "07:00 AM", class_name: "Power Yoga", class_type: "Yoga", member_name: "Nicole Foster", trainer: "Sarah Chen", status: "attended" },
  { id: "bk_06", time: "07:00 AM", class_name: "Power Yoga", class_type: "Yoga", member_name: "Samantha Lee", trainer: "Sarah Chen", status: "confirmed" },
  { id: "bk_07", time: "08:00 AM", class_name: "Strength Foundations", class_type: "Strength", member_name: "Kevin Thompson", trainer: "David Okafor", status: "attended" },
  { id: "bk_08", time: "08:00 AM", class_name: "Strength Foundations", class_type: "Strength", member_name: "Brandon Miller", trainer: "David Okafor", status: "attended" },
  { id: "bk_09", time: "09:00 AM", class_name: "CrossFit WOD", class_type: "CrossFit", member_name: "Rachel Adams", trainer: "Emily Rodriguez", status: "confirmed" },
  { id: "bk_10", time: "09:00 AM", class_name: "CrossFit WOD", class_type: "CrossFit", member_name: "Derek Patel", trainer: "Emily Rodriguez", status: "confirmed" },
  { id: "bk_11", time: "09:00 AM", class_name: "CrossFit WOD", class_type: "CrossFit", member_name: "Ryan O'Brien", trainer: "Emily Rodriguez", status: "waitlisted" },
  { id: "bk_12", time: "10:00 AM", class_name: "Boxing Fundamentals", class_type: "Boxing", member_name: "Marcus Johnson", trainer: "Aisha Patel", status: "confirmed" },
  { id: "bk_13", time: "10:00 AM", class_name: "Boxing Fundamentals", class_type: "Boxing", member_name: "David Kim", trainer: "Aisha Patel", status: "confirmed" },
  { id: "bk_14", time: "12:00 PM", class_name: "Lunch HIIT Express", class_type: "HIIT", member_name: "Sophia Martinez", trainer: "Marcus Cole", status: "confirmed" },
  { id: "bk_15", time: "12:00 PM", class_name: "Lunch HIIT Express", class_type: "HIIT", member_name: "Jennifer Chang", trainer: "Marcus Cole", status: "cancelled" },
  { id: "bk_16", time: "04:00 PM", class_name: "Evening Yoga Flow", class_type: "Yoga", member_name: "Chris Taylor", trainer: "Sarah Chen", status: "confirmed" },
  { id: "bk_17", time: "04:00 PM", class_name: "Evening Yoga Flow", class_type: "Yoga", member_name: "Emily Rodriguez", trainer: "Sarah Chen", status: "waitlisted" },
  { id: "bk_18", time: "05:30 PM", class_name: "Strength & Conditioning", class_type: "Strength", member_name: "James Wilson", trainer: "David Okafor", status: "confirmed" },
  { id: "bk_19", time: "05:30 PM", class_name: "Strength & Conditioning", class_type: "Strength", member_name: "Tyler Brooks", trainer: "David Okafor", status: "no_show" },
  { id: "bk_20", time: "07:00 PM", class_name: "Boxing Sparring", class_type: "Boxing", member_name: "Kevin Thompson", trainer: "Aisha Patel", status: "confirmed" },
];

// ---------------------------------------------------------------------------
// Today's schedule
// ---------------------------------------------------------------------------

const TODAYS_SCHEDULE: ScheduleClass[] = [
  { id: "sc_01", time: "06:00 AM", name: "HIIT Blast", trainer: "Marcus Cole", booked: 18, capacity: 20, type: "HIIT" },
  { id: "sc_02", time: "07:00 AM", name: "Power Yoga", trainer: "Sarah Chen", booked: 14, capacity: 15, type: "Yoga" },
  { id: "sc_03", time: "08:00 AM", name: "Strength Foundations", trainer: "David Okafor", booked: 12, capacity: 16, type: "Strength" },
  { id: "sc_04", time: "09:00 AM", name: "CrossFit WOD", trainer: "Emily Rodriguez", booked: 20, capacity: 20, type: "CrossFit" },
  { id: "sc_05", time: "10:00 AM", name: "Boxing Fundamentals", trainer: "Aisha Patel", booked: 10, capacity: 12, type: "Boxing" },
  { id: "sc_06", time: "12:00 PM", name: "Lunch HIIT Express", trainer: "Marcus Cole", booked: 15, capacity: 20, type: "HIIT" },
  { id: "sc_07", time: "04:00 PM", name: "Evening Yoga Flow", trainer: "Sarah Chen", booked: 13, capacity: 15, type: "Yoga" },
  { id: "sc_08", time: "05:30 PM", name: "Strength & Conditioning", trainer: "David Okafor", booked: 11, capacity: 16, type: "Strength" },
  { id: "sc_09", time: "07:00 PM", name: "Boxing Sparring", trainer: "Aisha Patel", booked: 8, capacity: 12, type: "Boxing" },
];

// ---------------------------------------------------------------------------
// Class type colors
// ---------------------------------------------------------------------------

const CLASS_TYPE_COLORS: Record<ClassType, { color: string; bg: string }> = {
  HIIT: { color: "text-red-400", bg: "bg-red-500/10" },
  Strength: { color: "text-blue-400", bg: "bg-blue-500/10" },
  CrossFit: { color: "text-orange-400", bg: "bg-orange-500/10" },
  Yoga: { color: "text-purple-400", bg: "bg-purple-500/10" },
  Boxing: { color: "text-yellow-400", bg: "bg-yellow-500/10" },
};

// ---------------------------------------------------------------------------
// KPI Cards
// ---------------------------------------------------------------------------

function StatsRow() {
  const kpis = [
    {
      label: "Today's Bookings",
      value: "89",
      icon: CalendarCheck,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      change: null,
    },
    {
      label: "Check-ins",
      value: "67",
      icon: UserCheck,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      change: "75% rate",
    },
    {
      label: "No-Shows",
      value: "8",
      icon: XCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      change: null,
    },
    {
      label: "Waitlisted",
      value: "12",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      change: null,
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
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
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
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.bg, cfg.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Bookings Table
// ---------------------------------------------------------------------------

function BookingsTable({
  bookings,
  onCheckIn,
  onCancel,
}: {
  bookings: Booking[];
  onCheckIn: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center shadow-lg">
        <CalendarCheck className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">No bookings found</p>
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
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trainer</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => {
              const typeCfg = CLASS_TYPE_COLORS[booking.class_type];
              return (
                <tr key={booking.id} className="transition-colors hover:bg-accent/30">
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{booking.class_name}</p>
                      <span className={cn("text-[10px] font-semibold", typeCfg.color)}>{booking.class_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {booking.member_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{booking.member_name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">{booking.trainer}</td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(booking.status === "confirmed" || booking.status === "waitlisted") && (
                        <>
                          <button
                            onClick={() => onCheckIn(booking.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20 cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Check In
                          </button>
                          <button
                            onClick={() => onCancel(booking.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "attended" && (
                        <span className="text-xs text-green-400 font-medium">Checked In</span>
                      )}
                      {booking.status === "no_show" && (
                        <span className="text-xs text-red-400 font-medium">Missed</span>
                      )}
                      {booking.status === "cancelled" && (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 lg:hidden">
        {bookings.map((booking) => {
          const typeCfg = CLASS_TYPE_COLORS[booking.class_type];
          return (
            <div key={booking.id} className="rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{booking.class_name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" /> {booking.time}
                    </span>
                    <span className={cn("font-semibold", typeCfg.color)}>{booking.class_type}</span>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {booking.member_name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{booking.member_name}</p>
                  <p className="text-[10px] text-muted-foreground">Trainer: {booking.trainer}</p>
                </div>
              </div>
              {(booking.status === "confirmed" || booking.status === "waitlisted") && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onCheckIn(booking.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Check In
                  </button>
                  <button
                    onClick={() => onCancel(booking.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Today's Schedule Sidebar
// ---------------------------------------------------------------------------

function TodaySchedule() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-primary" />
          Today&apos;s Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {TODAYS_SCHEDULE.map((cls) => {
          const typeCfg = CLASS_TYPE_COLORS[cls.type];
          const isFull = cls.booked >= cls.capacity;
          const fillPercent = Math.min((cls.booked / cls.capacity) * 100, 100);

          return (
            <div key={cls.id} className="rounded-xl border border-border bg-background p-3 transition-colors hover:border-border/80">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{cls.time}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold", typeCfg.bg, typeCfg.color)}>
                      {cls.type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.trainer}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("text-sm font-bold", isFull ? "text-red-400" : "text-foreground")}>
                    {cls.booked}/{cls.capacity}
                  </p>
                  {isFull && (
                    <span className="text-[9px] font-semibold text-red-400">FULL</span>
                  )}
                </div>
              </div>
              {/* Capacity bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isFull ? "bg-red-500" : fillPercent > 80 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [classFilter, setClassFilter] = useState<ClassType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (classFilter !== "all" && b.class_type !== classFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.member_name.toLowerCase().includes(q) &&
          !b.class_name.toLowerCase().includes(q) &&
          !b.trainer.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [bookings, classFilter, statusFilter, search]);

  const handleCheckIn = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "attended" as BookingStatus } : b))
    );
  };

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Bookings Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage today&apos;s class bookings, check-ins, and schedule
        </p>
      </div>

      {/* KPI Stats */}
      <StatsRow />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Left: Filters + Table (3 cols) */}
        <div className="space-y-4 xl:col-span-3">
          {/* Date & Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Date */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 rounded-xl border border-border bg-muted px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer [color-scheme:dark]"
            />

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search member, class, trainer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Class filter */}
            <div className="relative">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value as ClassType | "all")}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 cursor-pointer"
              >
                <option value="all">All Classes</option>
                <option value="HIIT">HIIT</option>
                <option value="Strength">Strength</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Yoga">Yoga</option>
                <option value="Boxing">Boxing</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="attended">Attended</option>
                <option value="no_show">No Show</option>
                <option value="cancelled">Cancelled</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Bookings Table */}
          <BookingsTable bookings={filteredBookings} onCheckIn={handleCheckIn} onCancel={handleCancel} />
        </div>

        {/* Right: Today's Schedule sidebar (1 col) */}
        <div className="xl:col-span-1">
          <TodaySchedule />
        </div>
      </div>
    </div>
  );
}
