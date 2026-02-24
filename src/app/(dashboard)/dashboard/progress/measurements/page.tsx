"use client";

import { useState } from "react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowDownRight,
  ArrowUpRight,
  Trophy,
  Scale,
  Percent,
  Ruler,
  Save,
  StickyNote,
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const today = new Date();

interface MeasurementEntry {
  id: number;
  date: Date;
  weight: number;
  bodyFat: number;
  chest: number;
  waist: number;
  hips: number;
  leftArm: number;
  rightArm: number;
  leftThigh: number;
  rightThigh: number;
  notes: string;
}

const measurementHistory: MeasurementEntry[] = [
  {
    id: 1,
    date: subDays(today, 0),
    weight: 82.5,
    bodyFat: 18.2,
    chest: 102,
    waist: 84,
    hips: 98,
    leftArm: 36.5,
    rightArm: 37,
    leftThigh: 58,
    rightThigh: 58.5,
    notes: "Feeling strong after this week's training block.",
  },
  {
    id: 2,
    date: subDays(today, 7),
    weight: 82.8,
    bodyFat: 18.5,
    chest: 101.5,
    waist: 84.5,
    hips: 98.5,
    leftArm: 36,
    rightArm: 36.8,
    leftThigh: 57.5,
    rightThigh: 58,
    notes: "Slightly bloated from weekend meals.",
  },
  {
    id: 3,
    date: subDays(today, 14),
    weight: 83.0,
    bodyFat: 18.8,
    chest: 101,
    waist: 85,
    hips: 99,
    leftArm: 36,
    rightArm: 36.5,
    leftThigh: 57.5,
    rightThigh: 57.8,
    notes: "Consistent with meal prep.",
  },
  {
    id: 4,
    date: subDays(today, 21),
    weight: 83.2,
    bodyFat: 19.0,
    chest: 101,
    waist: 85.5,
    hips: 99,
    leftArm: 35.8,
    rightArm: 36.2,
    leftThigh: 57,
    rightThigh: 57.5,
    notes: "",
  },
  {
    id: 5,
    date: subDays(today, 28),
    weight: 83.5,
    bodyFat: 19.2,
    chest: 100.5,
    waist: 86,
    hips: 99.5,
    leftArm: 35.5,
    rightArm: 36,
    leftThigh: 57,
    rightThigh: 57,
    notes: "Started new training program this week.",
  },
  {
    id: 6,
    date: subDays(today, 35),
    weight: 83.7,
    bodyFat: 19.5,
    chest: 100,
    waist: 86.5,
    hips: 99.5,
    leftArm: 35.2,
    rightArm: 35.8,
    leftThigh: 56.5,
    rightThigh: 56.8,
    notes: "Recovering from a cold, missed two sessions.",
  },
  {
    id: 7,
    date: subDays(today, 42),
    weight: 84.0,
    bodyFat: 19.8,
    chest: 100,
    waist: 87,
    hips: 100,
    leftArm: 35,
    rightArm: 35.5,
    leftThigh: 56,
    rightThigh: 56.5,
    notes: "",
  },
  {
    id: 8,
    date: subDays(today, 49),
    weight: 84.2,
    bodyFat: 20.0,
    chest: 99.5,
    waist: 87.5,
    hips: 100,
    leftArm: 35,
    rightArm: 35.2,
    leftThigh: 56,
    rightThigh: 56,
    notes: "Holiday season impact on diet.",
  },
  {
    id: 9,
    date: subDays(today, 56),
    weight: 84.5,
    bodyFat: 20.2,
    chest: 99,
    waist: 88,
    hips: 100.5,
    leftArm: 34.8,
    rightArm: 35,
    leftThigh: 55.5,
    rightThigh: 55.8,
    notes: "Baseline measurement to start cut phase.",
  },
  {
    id: 10,
    date: subDays(today, 63),
    weight: 84.8,
    bodyFat: 20.5,
    chest: 99,
    waist: 88.5,
    hips: 101,
    leftArm: 34.5,
    rightArm: 34.8,
    leftThigh: 55,
    rightThigh: 55.5,
    notes: "First measurement log.",
  },
];

// Chart data: 12 data points over ~3 months
const weightChartData = [
  { date: "Dec 1", weight: 84.8 },
  { date: "Dec 8", weight: 84.5 },
  { date: "Dec 15", weight: 84.2 },
  { date: "Dec 22", weight: 84.0 },
  { date: "Jan 5", weight: 83.7 },
  { date: "Jan 12", weight: 83.5 },
  { date: "Jan 19", weight: 83.2 },
  { date: "Jan 26", weight: 83.0 },
  { date: "Feb 2", weight: 82.8 },
  { date: "Feb 9", weight: 82.5 },
  { date: "Feb 16", weight: 82.5 },
  { date: "Feb 23", weight: 82.5 },
];

const bodyFatChartData = [
  { date: "Dec 1", bodyFat: 20.5 },
  { date: "Dec 8", bodyFat: 20.2 },
  { date: "Dec 15", bodyFat: 20.0 },
  { date: "Dec 22", bodyFat: 19.8 },
  { date: "Jan 5", bodyFat: 19.5 },
  { date: "Jan 12", bodyFat: 19.2 },
  { date: "Jan 19", bodyFat: 19.0 },
  { date: "Jan 26", bodyFat: 18.8 },
  { date: "Feb 2", bodyFat: 18.5 },
  { date: "Feb 9", bodyFat: 18.2 },
  { date: "Feb 16", bodyFat: 18.2 },
  { date: "Feb 23", bodyFat: 18.2 },
];

const personalRecords = [
  {
    label: "Lowest Weight",
    value: "80.2",
    unit: "kg",
    date: "Oct 15, 2025",
    icon: Scale,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Lowest Body Fat",
    value: "16.8",
    unit: "%",
    date: "Sep 22, 2025",
    icon: Percent,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    label: "Biggest Arms",
    value: "38.5",
    unit: "cm",
    date: "Aug 10, 2025",
    icon: Ruler,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Smallest Waist",
    value: "78.2",
    unit: "cm",
    date: "Sep 30, 2025",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

// ---------------------------------------------------------------------------
// Custom Tooltips
// ---------------------------------------------------------------------------

function WeightTooltip({
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

function BodyFatTooltip({
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
        {payload[0].value}%
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Change Indicator for Table
// ---------------------------------------------------------------------------

function WeightChange({ current, previous }: { current: number; previous: number }) {
  const diff = +(current - previous).toFixed(1);
  if (diff === 0) {
    return <span className="text-xs text-muted-foreground">--</span>;
  }
  // For weight, decrease is positive (green), increase is negative (red)
  const decreased = diff < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        decreased ? "text-emerald-500" : "text-red-500"
      )}
    >
      {decreased ? (
        <ArrowDownRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5" />
      )}
      {diff > 0 ? "+" : ""}
      {diff} kg
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function MeasurementsPage() {
  const [formOpen, setFormOpen] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(format(today, "yyyy-MM-dd"));
  const [formWeight, setFormWeight] = useState("");
  const [formBodyFat, setFormBodyFat] = useState("");
  const [formChest, setFormChest] = useState("");
  const [formWaist, setFormWaist] = useState("");
  const [formHips, setFormHips] = useState("");
  const [formLeftArm, setFormLeftArm] = useState("");
  const [formRightArm, setFormRightArm] = useState("");
  const [formLeftThigh, setFormLeftThigh] = useState("");
  const [formRightThigh, setFormRightThigh] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const inputClasses =
    "w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Page Header                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/progress"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
              Body Measurements
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Track and visualize your body composition over time.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setFormOpen(!formOpen)}
        >
          <Plus className="h-4 w-4" />
          Log New Measurement
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Log New Measurement Form (Collapsible)                         */}
      {/* ----------------------------------------------------------------- */}
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300",
          formOpen ? "max-h-[2000px] opacity-100" : "max-h-0 border-0 opacity-0"
        )}
      >
        <CardHeader
          className="cursor-pointer"
          onClick={() => setFormOpen(!formOpen)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <StickyNote className="h-5 w-5 text-primary" />
              Log New Measurement
            </CardTitle>
            {formOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setFormOpen(false);
            }}
          >
            {/* Date + Weight + Body Fat */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 82.5"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  Body Fat %
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 18.2"
                  value={formBodyFat}
                  onChange={(e) => setFormBodyFat(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Body measurements grid (2 cols) */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Body Measurements (cm)
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Chest
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Waist
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Hips
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formHips}
                    onChange={(e) => setFormHips(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Left Arm
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formLeftArm}
                    onChange={(e) => setFormLeftArm(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Right Arm
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formRightArm}
                    onChange={(e) => setFormRightArm(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Left Thigh
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formLeftThigh}
                    onChange={(e) => setFormLeftThigh(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Right Thigh
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="cm"
                    value={formRightThigh}
                    onChange={(e) => setFormRightThigh(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <textarea
                rows={3}
                placeholder="How are you feeling? Any observations..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className={cn(inputClasses, "resize-none")}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <Save className="h-4 w-4" />
                Save Measurement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Measurement Trends Charts                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Weight Over Time
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last 3 months of weight tracking
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightChartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#262626"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={{ stroke: "#262626" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<WeightTooltip />}
                    cursor={{ stroke: "#262626" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{
                      r: 3.5,
                      fill: "#ef4444",
                      stroke: "#111111",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 5.5,
                      fill: "#ef4444",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Body Fat % Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Body Fat % Over Time
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last 3 months of body fat tracking
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={bodyFatChartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#262626"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={{ stroke: "#262626" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<BodyFatTooltip />}
                    cursor={{ stroke: "#262626" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    dot={{
                      r: 3.5,
                      fill: "#f97316",
                      stroke: "#111111",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 5.5,
                      fill: "#f97316",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Measurements History Table                                     */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Measurement History
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your chronological measurement log
          </p>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Date</th>
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Weight</th>
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Body Fat</th>
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Chest</th>
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Waist</th>
                  <th className="whitespace-nowrap pb-3 pr-4 font-medium">Hips</th>
                  <th className="whitespace-nowrap pb-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {measurementHistory.map((entry, index) => {
                  const prevEntry = measurementHistory[index + 1];
                  return (
                    <tr key={entry.id} className="group">
                      <td className="whitespace-nowrap py-3 pr-4 font-medium text-foreground">
                        {format(entry.date, "MMM d, yyyy")}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">
                            {entry.weight} kg
                          </span>
                          {prevEntry && (
                            <WeightChange
                              current={entry.weight}
                              previous={prevEntry.weight}
                            />
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-foreground">
                        {entry.bodyFat}%
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {entry.chest} cm
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {entry.waist} cm
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                        {entry.hips} cm
                      </td>
                      <td className="max-w-[200px] truncate py-3 text-muted-foreground">
                        {entry.notes || "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="space-y-3 md:hidden">
            {measurementHistory.map((entry, index) => {
              const prevEntry = measurementHistory[index + 1];
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border bg-muted/50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {format(entry.date, "MMM d, yyyy")}
                    </span>
                    {prevEntry && (
                      <WeightChange
                        current={entry.weight}
                        previous={prevEntry.weight}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium text-foreground">
                        {entry.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Body Fat</span>
                      <span className="font-medium text-foreground">
                        {entry.bodyFat}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chest</span>
                      <span className="text-foreground">{entry.chest} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waist</span>
                      <span className="text-foreground">{entry.waist} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hips</span>
                      <span className="text-foreground">{entry.hips} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arms</span>
                      <span className="text-foreground">
                        {entry.leftArm}/{entry.rightArm} cm
                      </span>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 truncate border-t border-border pt-2 text-xs text-muted-foreground">
                      {entry.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Personal Records Section                                       */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="mb-4 font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground">
          Personal Records
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personalRecords.map((record) => {
            const Icon = record.icon;
            return (
              <Card key={record.label} className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div
                    className={cn(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                      record.bgColor
                    )}
                  >
                    <Icon className={cn("h-5 w-5", record.color)} />
                  </div>
                  <p className="text-sm text-muted-foreground">{record.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {record.value}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {record.unit}
                    </span>
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {record.date}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
