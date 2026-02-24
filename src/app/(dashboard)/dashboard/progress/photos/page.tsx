"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Upload,
  X,
  Trash2,
  ImageIcon,
  CalendarDays,
  Images,
  ChevronDown,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhotoType = "Front" | "Side" | "Back" | "Other";

interface ProgressPhoto {
  id: string;
  type: PhotoType;
  date: Date;
  caption: string;
  fileName: string;
}

interface PreviewFile {
  file: File;
  preview: string;
  id: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockPhotos: ProgressPhoto[] = [
  {
    id: "p1",
    type: "Front",
    date: new Date(2026, 1, 22),
    caption: "Feeling stronger after 3 months of training",
    fileName: "front_feb22.jpg",
  },
  {
    id: "p2",
    type: "Side",
    date: new Date(2026, 1, 22),
    caption: "Side view — visible posture improvement",
    fileName: "side_feb22.jpg",
  },
  {
    id: "p3",
    type: "Back",
    date: new Date(2026, 1, 15),
    caption: "Back development progressing",
    fileName: "back_feb15.jpg",
  },
  {
    id: "p4",
    type: "Front",
    date: new Date(2026, 0, 28),
    caption: "Two months in — consistency is key",
    fileName: "front_jan28.jpg",
  },
  {
    id: "p5",
    type: "Side",
    date: new Date(2026, 0, 28),
    caption: "Side profile update",
    fileName: "side_jan28.jpg",
  },
  {
    id: "p6",
    type: "Back",
    date: new Date(2026, 0, 14),
    caption: "Back shot mid-January",
    fileName: "back_jan14.jpg",
  },
  {
    id: "p7",
    type: "Other",
    date: new Date(2026, 0, 14),
    caption: "Flexing arms progress",
    fileName: "arms_jan14.jpg",
  },
  {
    id: "p8",
    type: "Front",
    date: new Date(2025, 11, 20),
    caption: "One month progress front pose",
    fileName: "front_dec20.jpg",
  },
  {
    id: "p9",
    type: "Side",
    date: new Date(2025, 11, 5),
    caption: "Starting point — side view",
    fileName: "side_dec5.jpg",
  },
  {
    id: "p10",
    type: "Front",
    date: new Date(2025, 11, 5),
    caption: "Day one — starting point",
    fileName: "front_dec5.jpg",
  },
];

// Simulated measurements for comparison
const mockMeasurements: Record<
  string,
  { weight: number; bodyFat: number; chest: number; waist: number }
> = {
  p1: { weight: 82.5, bodyFat: 18.2, chest: 102, waist: 84 },
  p2: { weight: 82.5, bodyFat: 18.2, chest: 102, waist: 84 },
  p3: { weight: 82.8, bodyFat: 18.5, chest: 101.5, waist: 84.5 },
  p4: { weight: 83.2, bodyFat: 19.0, chest: 101, waist: 85 },
  p5: { weight: 83.2, bodyFat: 19.0, chest: 101, waist: 85 },
  p6: { weight: 83.7, bodyFat: 19.4, chest: 100.5, waist: 85.5 },
  p7: { weight: 83.7, bodyFat: 19.4, chest: 100.5, waist: 85.5 },
  p8: { weight: 84.2, bodyFat: 19.8, chest: 100, waist: 86 },
  p9: { weight: 84.8, bodyFat: 20.1, chest: 99.5, waist: 86.5 },
  p10: { weight: 84.8, bodyFat: 20.1, chest: 99.5, waist: 86.5 },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const photoTypeBadgeClass: Record<PhotoType, string> = {
  Front: "bg-blue-500/10 text-blue-400",
  Side: "bg-emerald-500/10 text-emerald-400",
  Back: "bg-purple-500/10 text-purple-400",
  Other: "bg-neutral-500/10 text-neutral-400",
};

function groupPhotosByMonth(photos: ProgressPhoto[]) {
  const groups: Record<string, ProgressPhoto[]> = {};
  for (const photo of photos) {
    const key = format(photo.date, "yyyy-MM");
    if (!groups[key]) groups[key] = [];
    groups[key].push(photo);
  }
  // Sort keys descending (newest first)
  const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  return sortedKeys.map((key) => ({
    key,
    label: format(parse(key, "yyyy-MM", new Date()), "MMMM yyyy"),
    photos: groups[key].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    ),
  }));
}

// ---------------------------------------------------------------------------
// Photo Placeholder Component
// ---------------------------------------------------------------------------

function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900",
        className
      )}
    >
      <Camera className="h-10 w-10 text-neutral-600" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProgressPhotosPage() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>(mockPhotos);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [photoType, setPhotoType] = useState<PhotoType>("Front");
  const [photoDate, setPhotoDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [caption, setCaption] = useState("");
  const [beforeId, setBeforeId] = useState("");
  const [afterId, setAfterId] = useState("");

  // -----------------------------------------------------------------------
  // Dropzone
  // -----------------------------------------------------------------------

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removePreview = (id: string) => {
    setPreviewFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleUpload = () => {
    if (previewFiles.length === 0) return;

    const newPhotos: ProgressPhoto[] = previewFiles.map((pf) => ({
      id: crypto.randomUUID(),
      type: photoType,
      date: new Date(photoDate),
      caption,
      fileName: pf.file.name,
    }));

    setPhotos((prev) => [...newPhotos, ...prev]);
    // Clean up previews
    previewFiles.forEach((pf) => URL.revokeObjectURL(pf.preview));
    setPreviewFiles([]);
    setCaption("");
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (beforeId === id) setBeforeId("");
    if (afterId === id) setAfterId("");
  };

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------

  const grouped = useMemo(() => groupPhotosByMonth(photos), [photos]);

  const totalPhotos = photos.length;
  const thisMonthCount = photos.filter(
    (p) =>
      p.date.getMonth() === new Date().getMonth() &&
      p.date.getFullYear() === new Date().getFullYear()
  ).length;
  const firstPhotoDate = useMemo(() => {
    if (photos.length === 0) return null;
    const sorted = [...photos].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return sorted[0].date;
  }, [photos]);

  const beforePhoto = photos.find((p) => p.id === beforeId);
  const afterPhoto = photos.find((p) => p.id === afterId);
  const beforeMeasurements = beforeId ? mockMeasurements[beforeId] : null;
  const afterMeasurements = afterId ? mockMeasurements[afterId] : null;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/progress"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground">
              Progress Photos
            </h2>
            <p className="text-sm text-muted-foreground">
              Document your transformation with progress photos.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <Upload className="h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats Row                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Photos",
            value: totalPhotos,
            icon: Images,
          },
          {
            label: "This Month",
            value: thisMonthCount,
            icon: CalendarDays,
          },
          {
            label: "First Photo",
            value: firstPhotoDate ? format(firstPhotoDate, "MMM d, yyyy") : "--",
            icon: Camera,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Upload Section                                                    */}
      {/* ----------------------------------------------------------------- */}
      <Card id="upload-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-muted-foreground/40"
            )}
          >
            <input {...getInputProps()} />
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {isDragActive
                ? "Drop your photos here..."
                : "Drag & drop your progress photos here, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, or WebP up to 10MB
            </p>
          </div>

          {/* Preview thumbnails */}
          {previewFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Selected Files ({previewFiles.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {previewFiles.map((pf) => (
                  <div
                    key={pf.id}
                    className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pf.preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(pf.id);
                      }}
                      className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-white">
                      {pf.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta fields */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Photo Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Photo Type
              </label>
              <div className="relative">
                <select
                  value={photoType}
                  onChange={(e) => setPhotoType(e.target.value as PhotoType)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-muted px-3 pr-8 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="Front">Front</option>
                  <option value="Side">Side</option>
                  <option value="Back">Back</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Date
              </label>
              <input
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground outline-none transition-colors focus:border-primary [color-scheme:dark]"
              />
            </div>

            {/* Caption */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-sm font-medium text-foreground">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a note about your progress..."
                rows={1}
                className="min-h-10 w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              disabled={previewFiles.length === 0}
            >
              <Upload className="h-4 w-4" />
              Upload {previewFiles.length > 0 && `(${previewFiles.length})`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Photo Timeline                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-8">
        <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-foreground">
          Photo Timeline
        </h3>

        {grouped.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No photos yet. Upload your first progress photo above!
            </p>
          </div>
        )}

        <div className="relative space-y-10">
          {/* Vertical timeline line */}
          {grouped.length > 0 && (
            <div className="absolute top-2 bottom-2 left-3 hidden w-px bg-border sm:block" />
          )}

          {grouped.map((group) => (
            <div key={group.key} className="relative">
              {/* Month header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
                <h4 className="font-[var(--font-oswald)] text-lg font-semibold uppercase tracking-wide text-foreground">
                  {group.label}
                </h4>
                <Badge variant="outline">{group.photos.length} photos</Badge>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 gap-4 sm:ml-10 md:grid-cols-3 lg:grid-cols-4">
                {group.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
                  >
                    {/* Image placeholder */}
                    <PhotoPlaceholder className="aspect-[3/4] w-full" />

                    {/* Details */}
                    <div className="space-y-2 p-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            photoTypeBadgeClass[photo.type]
                          )}
                        >
                          {photo.type}
                        </span>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="cursor-pointer text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                          title="Delete photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {format(photo.date, "MMM d, yyyy")}
                      </p>

                      <p className="truncate text-xs text-foreground">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Side-by-Side Comparison                                           */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Images className="h-5 w-5 text-primary" />
            Compare Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Before */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Before
              </label>
              <div className="relative">
                <select
                  value={beforeId}
                  onChange={(e) => setBeforeId(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-muted px-3 pr-8 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="">Select a photo...</option>
                  {photos
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {format(p.date, "MMM d, yyyy")} &mdash; {p.type}
                        {p.caption ? ` — ${p.caption.slice(0, 30)}` : ""}
                      </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* After */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                After
              </label>
              <div className="relative">
                <select
                  value={afterId}
                  onChange={(e) => setAfterId(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-muted px-3 pr-8 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="">Select a photo...</option>
                  {photos
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {format(p.date, "MMM d, yyyy")} &mdash; {p.type}
                        {p.caption ? ` — ${p.caption.slice(0, 30)}` : ""}
                      </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Side-by-side images */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Before image */}
            <div className="space-y-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Before
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <PhotoPlaceholder className="aspect-[3/4] w-full" />
              </div>
              {beforePhoto && (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {format(beforePhoto.date, "MMMM d, yyyy")}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      photoTypeBadgeClass[beforePhoto.type]
                    )}
                  >
                    {beforePhoto.type}
                  </span>
                </div>
              )}
            </div>

            {/* After image */}
            <div className="space-y-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                After
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <PhotoPlaceholder className="aspect-[3/4] w-full" />
              </div>
              {afterPhoto && (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {format(afterPhoto.date, "MMMM d, yyyy")}
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      photoTypeBadgeClass[afterPhoto.type]
                    )}
                  >
                    {afterPhoto.type}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Measurement changes between before & after */}
          {beforeMeasurements && afterMeasurements && (
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Changes Between Dates
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(
                  [
                    { key: "weight" as const, label: "Weight", unit: "kg" },
                    { key: "bodyFat" as const, label: "Body Fat", unit: "%" },
                    { key: "chest" as const, label: "Chest", unit: "cm" },
                    { key: "waist" as const, label: "Waist", unit: "cm" },
                  ] as const
                ).map(({ key, label, unit }) => {
                  const diff = +(
                    afterMeasurements[key] - beforeMeasurements[key]
                  ).toFixed(1);
                  const isPositive = diff > 0;
                  const isNegative = diff < 0;

                  return (
                    <div key={key} className="text-center">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {afterMeasurements[key]}
                        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                          {unit}
                        </span>
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-xs font-medium",
                          diff === 0
                            ? "text-muted-foreground"
                            : key === "waist" || key === "bodyFat"
                              ? isNegative
                                ? "text-emerald-500"
                                : "text-red-400"
                              : isPositive
                                ? "text-emerald-500"
                                : "text-red-400"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {diff} {unit}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!beforeId && !afterId && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Select a &quot;Before&quot; and &quot;After&quot; photo to compare
              your progress side by side.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
