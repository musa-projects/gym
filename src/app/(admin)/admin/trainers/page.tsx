"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  Eye,
  Mail,
  Phone,
  Star,
  Award,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  experience: number;
  activeClasses: number;
  rating: number;
  totalReviews: number;
  status: "Active" | "On Leave";
  avatarColor: string;
  classesThisMonth: number;
  studentsThisMonth: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TRAINERS: Trainer[] = [
  {
    id: "1",
    name: "Sarah Williams",
    email: "sarah.williams@bigvisiongym.com",
    phone: "+1 (555) 234-5678",
    specialties: ["HIIT", "CrossFit"],
    experience: 8,
    activeClasses: 4,
    rating: 4.9,
    totalReviews: 127,
    status: "Active",
    avatarColor: "bg-red-500",
    classesThisMonth: 28,
    studentsThisMonth: 342,
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@bigvisiongym.com",
    phone: "+1 (555) 345-6789",
    specialties: ["Strength", "Powerlifting"],
    experience: 12,
    activeClasses: 3,
    rating: 4.8,
    totalReviews: 198,
    status: "Active",
    avatarColor: "bg-orange-500",
    classesThisMonth: 24,
    studentsThisMonth: 286,
  },
  {
    id: "3",
    name: "Aisha Patel",
    email: "aisha.patel@bigvisiongym.com",
    phone: "+1 (555) 456-7890",
    specialties: ["Yoga", "Pilates"],
    experience: 6,
    activeClasses: 3,
    rating: 4.9,
    totalReviews: 156,
    status: "Active",
    avatarColor: "bg-green-500",
    classesThisMonth: 26,
    studentsThisMonth: 310,
  },
  {
    id: "4",
    name: "David Rodriguez",
    email: "david.rodriguez@bigvisiongym.com",
    phone: "+1 (555) 567-8901",
    specialties: ["Boxing", "MMA"],
    experience: 10,
    activeClasses: 3,
    rating: 4.7,
    totalReviews: 143,
    status: "Active",
    avatarColor: "bg-blue-500",
    classesThisMonth: 22,
    studentsThisMonth: 264,
  },
  {
    id: "5",
    name: "Jake Morrison",
    email: "jake.morrison@bigvisiongym.com",
    phone: "+1 (555) 678-9012",
    specialties: ["CrossFit", "HIIT"],
    experience: 5,
    activeClasses: 2,
    rating: 4.6,
    totalReviews: 89,
    status: "Active",
    avatarColor: "bg-yellow-500",
    classesThisMonth: 18,
    studentsThisMonth: 198,
  },
  {
    id: "6",
    name: "Nina Kowalski",
    email: "nina.kowalski@bigvisiongym.com",
    phone: "+1 (555) 789-0123",
    specialties: ["Cardio", "Dance"],
    experience: 7,
    activeClasses: 2,
    rating: 4.8,
    totalReviews: 112,
    status: "On Leave",
    avatarColor: "bg-purple-500",
    classesThisMonth: 0,
    studentsThisMonth: 0,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < fullStars
              ? "fill-yellow-500 text-yellow-500"
              : i === fullStars && hasHalf
                ? "fill-yellow-500/50 text-yellow-500"
                : "text-border"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminTrainersPage() {
  const [trainers] = useState<Trainer[]>(MOCK_TRAINERS);

  const activeTrainers = trainers.filter((t) => t.status === "Active");
  const maxClasses = Math.max(...trainers.map((t) => t.classesThisMonth));
  const averageRating =
    trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length;
  const totalStudents = trainers.reduce(
    (sum, t) => sum + t.studentsThisMonth,
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
            Trainers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trainers.length} trainers &middot; {activeTrainers.length} active
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4" />
          Add Trainer
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Trainer Cards Grid                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Card
            key={trainer.id}
            className={cn(
              "transition-colors hover:border-primary/20",
              trainer.status === "On Leave" && "opacity-70"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white",
                      trainer.avatarColor
                    )}
                  >
                    {getInitials(trainer.name)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{trainer.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-1.5">
                      <StarRating rating={trainer.rating} />
                      <span className="text-xs text-muted-foreground">
                        {trainer.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={trainer.status === "Active" ? "success" : "outline"}
                  className="text-[10px]"
                >
                  {trainer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5">
                  {trainer.specialties.map((spec) => (
                    <Badge
                      key={spec}
                      variant="default"
                      className="text-[10px] px-2 py-0.5"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-background p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {trainer.experience}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Yrs Exp</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-lg font-bold text-foreground">
                      {trainer.activeClasses}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Classes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {trainer.totalReviews}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Reviews</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Trainer Performance Summary                                       */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Performance Summary
        </h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Classes Taught This Month - Horizontal Bars */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Classes Taught This Month</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Per trainer breakdown
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainers
                  .sort((a, b) => b.classesThisMonth - a.classesThisMonth)
                  .map((trainer) => (
                    <div key={trainer.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full",
                              trainer.avatarColor
                            )}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {trainer.name.split(" ")[0]}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {trainer.classesThisMonth}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            trainer.avatarColor
                          )}
                          style={{
                            width:
                              maxClasses > 0
                                ? `${(trainer.classesThisMonth / maxClasses) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {averageRating.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg Class Rating
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <StarRating rating={averageRating} />
                  <span className="ml-1 text-xs text-muted-foreground">
                    across all trainers
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {totalStudents.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Students Trained
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  This month across all classes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {trainers.reduce((sum, t) => sum + t.classesThisMonth, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Classes This Month
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {activeTrainers.length} active trainers contributing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
