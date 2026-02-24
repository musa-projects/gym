"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  MessageSquare,
  Dumbbell,
  Flame,
  DollarSign,
  Users,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const member = {
  id: "1",
  name: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  phone: "+1 (555) 234-5678",
  plan: "Premium" as const,
  status: "Active" as const,
  joinDate: new Date(2024, 2, 15),
  avatarInitials: "SM",
};

const stats = [
  { label: "Total Classes", value: "47", icon: Dumbbell, color: "text-primary" },
  { label: "Current Streak", value: "5 days", icon: Flame, color: "text-secondary" },
  { label: "Amount Paid", value: "$826", icon: DollarSign, color: "text-emerald-400" },
  { label: "Referrals", value: "2", icon: Users, color: "text-blue-400" },
];

const membershipInfo = {
  planName: "Premium Monthly",
  billingCycle: "Monthly",
  nextBilling: new Date(2026, 2, 15),
  autoRenew: true,
  monthlyPrice: "$79.99",
};

const bookingHistory = [
  { id: "b1", date: new Date(2026, 1, 24), className: "HIIT Blast", trainer: "Marcus Johnson", status: "Upcoming" as const },
  { id: "b2", date: new Date(2026, 1, 22), className: "Power Yoga", trainer: "Sarah Chen", status: "Completed" as const },
  { id: "b3", date: new Date(2026, 1, 20), className: "Boxing Fundamentals", trainer: "David Okafor", status: "Completed" as const },
  { id: "b4", date: new Date(2026, 1, 18), className: "CrossFit", trainer: "Marcus Johnson", status: "Completed" as const },
  { id: "b5", date: new Date(2026, 1, 16), className: "Strength Training", trainer: "Emily Rodriguez", status: "Completed" as const },
  { id: "b6", date: new Date(2026, 1, 14), className: "HIIT Blast", trainer: "Marcus Johnson", status: "Completed" as const },
  { id: "b7", date: new Date(2026, 1, 11), className: "Spin & Burn", trainer: "Emily Rodriguez", status: "Cancelled" as const },
  { id: "b8", date: new Date(2026, 1, 9), className: "Boxing Fundamentals", trainer: "David Okafor", status: "Completed" as const },
  { id: "b9", date: new Date(2026, 1, 6), className: "Power Yoga", trainer: "Sarah Chen", status: "Completed" as const },
  { id: "b10", date: new Date(2026, 1, 3), className: "CrossFit", trainer: "Marcus Johnson", status: "No-show" as const },
];

const paymentHistory = [
  { id: "p1", date: new Date(2026, 1, 15), description: "Premium Monthly - Feb 2026", amount: "$79.99", status: "Paid" as const },
  { id: "p2", date: new Date(2026, 0, 15), description: "Premium Monthly - Jan 2026", amount: "$79.99", status: "Paid" as const },
  { id: "p3", date: new Date(2025, 11, 15), description: "Premium Monthly - Dec 2025", amount: "$79.99", status: "Paid" as const },
  { id: "p4", date: new Date(2025, 10, 15), description: "Premium Monthly - Nov 2025", amount: "$79.99", status: "Paid" as const },
  { id: "p5", date: new Date(2025, 9, 15), description: "Personal Training Session x2", amount: "$149.98", status: "Paid" as const },
];

const existingNotes = [
  { date: new Date(2026, 1, 10), author: "Admin", text: "Interested in upgrading to VIP plan. Follow up next month." },
  { date: new Date(2026, 0, 5), author: "Admin", text: "Had a billing issue - resolved. Applied 10% discount for next month as goodwill." },
  { date: new Date(2025, 11, 18), author: "Manager", text: "Referred two new members (Lisa Patel & Kevin Nguyen). Consider loyalty reward." },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bookingStatusClasses(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-500/10 text-blue-400";
    case "Completed":
      return "bg-emerald-500/10 text-emerald-400";
    case "Cancelled":
      return "bg-red-500/10 text-red-400";
    case "No-show":
      return "bg-amber-500/10 text-amber-400";
    default:
      return "bg-neutral-500/10 text-neutral-400";
  }
}

function paymentStatusClasses(status: string) {
  switch (status) {
    case "Paid":
      return "bg-emerald-500/10 text-emerald-400";
    case "Pending":
      return "bg-amber-500/10 text-amber-400";
    case "Failed":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-neutral-500/10 text-neutral-400";
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MemberDetailContent() {
  const [noteText, setNoteText] = useState("");

  return (
    <div className="space-y-8">
      {/* ── Back Link ─────────────────────────────────────────────────── */}
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </Link>

      {/* ── Member Header ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary sm:h-20 sm:w-20 sm:text-2xl">
                {member.avatarInitials}
              </div>
              <div>
                <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                  {member.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                <p className="text-sm text-muted-foreground">{member.phone}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="default">{member.plan}</Badge>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    {member.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Member since {format(member.joinDate, "MMMM yyyy")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="group transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Membership Info ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Membership Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{membershipInfo.planName}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Billing Cycle</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{membershipInfo.billingCycle}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Next Billing Date</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {format(membershipInfo.nextBilling, "MMM d, yyyy")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Auto-Renew</p>
              <div className="mt-1 flex items-center gap-1.5">
                <RefreshCw className={cn("h-4 w-4", membershipInfo.autoRenew ? "text-emerald-400" : "text-muted-foreground")} />
                <p className={cn("text-sm font-semibold", membershipInfo.autoRenew ? "text-emerald-400" : "text-muted-foreground")}>
                  {membershipInfo.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Booking History ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trainer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookingHistory.map((booking) => (
                  <tr key={booking.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{format(booking.date, "MMM d, yyyy")}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{booking.className}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{booking.trainer}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", bookingStatusClasses(booking.status))}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {bookingHistory.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{booking.className}</p>
                  <p className="text-xs text-muted-foreground">{booking.trainer} &middot; {format(booking.date, "MMM d")}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", bookingStatusClasses(booking.status))}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Payment History ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{format(payment.date, "MMM d, yyyy")}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{payment.description}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{payment.amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", paymentStatusClasses(payment.status))}>
                        <CheckCircle2 className="h-3 w-3" />
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{payment.description}</p>
                  <p className="text-xs text-muted-foreground">{format(payment.date, "MMM d, yyyy")}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-foreground">{payment.amount}</p>
                  <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", paymentStatusClasses(payment.status))}>
                    <CheckCircle2 className="h-3 w-3" />
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Admin Notes ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Admin Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-3">
            {existingNotes.map((note, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{note.author}</span>
                  <span className="text-xs text-muted-foreground">{format(note.date, "MMM d, yyyy")}</span>
                </div>
                <p className="text-sm text-foreground">{note.text}</p>
              </div>
            ))}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Add a Note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note about this member..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-3 flex justify-end">
              <Button variant="primary" size="sm" disabled={!noteText.trim()}>
                Save Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
