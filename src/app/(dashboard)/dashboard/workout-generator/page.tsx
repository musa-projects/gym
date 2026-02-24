"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  Loader2,
  Clock,
  Dumbbell,
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
  Zap,
  Flame,
  Wind,
  StretchHorizontal,
  Target,
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
// Constants
// ---------------------------------------------------------------------------

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Full Body",
] as const;

const WORKOUT_TYPES = [
  { label: "General", icon: Target },
  { label: "Strength", icon: Dumbbell },
  { label: "HIIT", icon: Zap },
  { label: "Cardio", icon: Flame },
  { label: "Flexibility", icon: StretchHorizontal },
  { label: "Full Body", icon: Wind },
] as const;

const DURATIONS = [15, 30, 45, 60, 90] as const;

const DIFFICULTIES = [
  { label: "Beginner", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500" },
  { label: "Intermediate", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500" },
  { label: "Advanced", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500" },
] as const;

const EQUIPMENT = [
  "Bodyweight",
  "Dumbbells",
  "Barbell",
  "Kettlebell",
  "Resistance Bands",
  "Pull-up Bar",
  "Cable Machine",
  "Full Gym",
] as const;

// ---------------------------------------------------------------------------
// Mock Workout History
// ---------------------------------------------------------------------------

interface SavedWorkout {
  id: string;
  title: string;
  date: string;
  duration: number;
  difficulty: string;
  muscleGroups: string[];
  content: string;
  isFavorite: boolean;
}

const MOCK_SAVED_WORKOUTS: SavedWorkout[] = [
  {
    id: "w1",
    title: "Upper Body Strength Blast",
    date: "Feb 22, 2026",
    duration: 45,
    difficulty: "Intermediate",
    muscleGroups: ["Chest", "Back", "Shoulders"],
    content: `WARM-UP (5 minutes)
- Arm circles: 30 seconds each direction
- Band pull-aparts: 15 reps
- Push-up to downward dog: 8 reps

MAIN WORKOUT (35 minutes)

Superset 1 (3 rounds):
  A1. Barbell Bench Press: 10, 8, 6 reps
  A2. Bent-Over Barbell Row: 10, 8, 6 reps
  Rest: 90 seconds between rounds

Superset 2 (3 rounds):
  B1. Overhead Dumbbell Press: 12 reps
  B2. Lat Pulldown: 12 reps
  Rest: 60 seconds between rounds

Superset 3 (3 rounds):
  C1. Incline Dumbbell Fly: 15 reps
  C2. Face Pulls: 15 reps
  Rest: 45 seconds between rounds

COOL-DOWN (5 minutes)
- Doorway chest stretch: 30 seconds each side
- Cross-body shoulder stretch: 30 seconds each
- Cat-cow stretches: 10 reps`,
    isFavorite: true,
  },
  {
    id: "w2",
    title: "HIIT Leg Burner",
    date: "Feb 20, 2026",
    duration: 30,
    difficulty: "Advanced",
    muscleGroups: ["Legs", "Core"],
    content: `WARM-UP (3 minutes)
- High knees: 30 seconds
- Bodyweight squats: 15 reps
- Leg swings: 10 each side

HIIT CIRCUIT (24 minutes)
Perform each exercise for 40 seconds, rest 20 seconds.
Complete 4 rounds total.

Round exercises:
1. Jump Squats
2. Walking Lunges
3. Burpees
4. Box Jumps (or step-ups)
5. Mountain Climbers
6. Bulgarian Split Squats (alternate legs each round)

Rest 60 seconds between rounds.

COOL-DOWN (3 minutes)
- Quad stretch: 30 seconds each leg
- Hamstring stretch: 30 seconds each leg
- Pigeon pose: 30 seconds each side`,
    isFavorite: false,
  },
  {
    id: "w3",
    title: "Full Body Beginner Flow",
    date: "Feb 18, 2026",
    duration: 60,
    difficulty: "Beginner",
    muscleGroups: ["Full Body"],
    content: `WARM-UP (8 minutes)
- March in place: 2 minutes
- Arm circles: 1 minute
- Bodyweight squats: 10 reps
- Cat-cow stretch: 10 reps
- Hip circles: 10 each direction

MAIN WORKOUT (44 minutes)

Block 1 - Lower Body (15 min):
  1. Goblet Squats: 3 x 12 reps
  2. Romanian Deadlift (light): 3 x 10 reps
  3. Step-Ups: 3 x 10 each leg
  Rest: 60 seconds between sets

Block 2 - Upper Body (15 min):
  1. Push-Ups (or knee push-ups): 3 x 10 reps
  2. Dumbbell Rows: 3 x 12 each arm
  3. Overhead Press (light): 3 x 10 reps
  Rest: 60 seconds between sets

Block 3 - Core (14 min):
  1. Dead Bug: 3 x 10 each side
  2. Plank Hold: 3 x 30 seconds
  3. Bird Dog: 3 x 8 each side
  4. Glute Bridge: 3 x 15 reps
  Rest: 45 seconds between sets

COOL-DOWN (8 minutes)
- Child's pose: 1 minute
- Hamstring stretch: 1 minute each leg
- Quad stretch: 30 seconds each leg
- Chest opener stretch: 1 minute
- Seated spinal twist: 30 seconds each side
- Deep breathing: 2 minutes`,
    isFavorite: true,
  },
  {
    id: "w4",
    title: "Core & Arms Dumbbell Session",
    date: "Feb 15, 2026",
    duration: 45,
    difficulty: "Intermediate",
    muscleGroups: ["Arms", "Core"],
    content: `WARM-UP (5 minutes)
- Jumping jacks: 1 minute
- Arm circles: 30 seconds each direction
- Plank hold: 30 seconds
- Inchworms: 5 reps

MAIN WORKOUT (35 minutes)

Superset 1 - Biceps & Core (3 rounds):
  A1. Dumbbell Bicep Curls: 12 reps
  A2. Hanging Knee Raises: 12 reps
  Rest: 45 seconds

Superset 2 - Triceps & Core (3 rounds):
  B1. Tricep Dips: 12 reps
  B2. Russian Twists: 20 reps
  Rest: 45 seconds

Superset 3 - Arms & Core (3 rounds):
  C1. Hammer Curls: 10 reps
  C2. Ab Wheel Rollouts: 8 reps
  Rest: 45 seconds

Finisher (3 rounds):
  D1. Close-Grip Push-Ups: 15 reps
  D2. Bicycle Crunches: 20 reps
  D3. Plank Shoulder Taps: 16 reps
  Rest: 30 seconds

COOL-DOWN (5 minutes)
- Tricep stretch: 30 seconds each arm
- Cobra stretch: 45 seconds
- Seated forward fold: 45 seconds
- Wrist stretches: 30 seconds`,
    isFavorite: false,
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function WorkoutGeneratorPage() {
  // Form state
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [workoutType, setWorkoutType] = useState("General");
  const [duration, setDuration] = useState(45);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Generation state
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // History state
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>(MOCK_SAVED_WORKOUTS);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Toggle helpers
  const toggleMuscleGroup = (group: string) => {
    setMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const toggleFavorite = (id: string) => {
    setSavedWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const deleteWorkout = (id: string) => {
    setSavedWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Stream the AI response
  const handleGenerate = useCallback(async () => {
    if (muscleGroups.length === 0) return;

    setIsGenerating(true);
    setOutput("");

    // Scroll output into view on mobile
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const res = await fetch("/api/ai/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          muscleGroups,
          duration,
          difficulty,
          equipment,
          workoutType,
          notes,
        }),
      });

      if (!res.ok) {
        setOutput("Something went wrong while generating your workout. Please try again.");
        setIsGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setOutput((prev) => prev + chunk);
      }
    } catch {
      setOutput("Failed to connect to the AI service. Please check your connection and try again.");
    }

    setIsGenerating(false);
  }, [muscleGroups, duration, difficulty, equipment, workoutType, notes]);

  const difficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "bg-green-500/10 text-green-400";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-400";
      case "Advanced":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-[var(--font-oswald)] text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              AI Workout Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Get a personalized workout plan powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Main 2-Column Layout                                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ─── Left Column: Form (40%) ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configure Your Workout</CardTitle>
              <CardDescription>
                Select your preferences and let AI build your plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Muscle Groups */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Muscle Groups
                </label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLE_GROUPS.map((group) => {
                    const isSelected = muscleGroups.includes(group);
                    return (
                      <button
                        key={group}
                        onClick={() => toggleMuscleGroup(group)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
                {muscleGroups.length === 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Select at least one muscle group
                  </p>
                )}
              </div>

              {/* Workout Type */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Workout Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {WORKOUT_TYPES.map((type) => {
                    const isSelected = workoutType === type.label;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.label}
                        onClick={() => setWorkoutType(type.label)}
                        className={cn(
                          "cursor-pointer inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((dur) => {
                    const isSelected = duration === dur;
                    return (
                      <button
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={cn(
                          "cursor-pointer inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {dur} min
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((diff) => {
                    const isSelected = difficulty === diff.label;
                    return (
                      <button
                        key={diff.label}
                        onClick={() => setDifficulty(diff.label)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-4 py-1.5 text-sm font-medium transition-all",
                          isSelected
                            ? `${diff.border} ${diff.bg} ${diff.color}`
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {diff.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Equipment Available
                </label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT.map((item) => {
                    const isSelected = equipment.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleEquipment(item)}
                        className={cn(
                          "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-foreground">
                  Additional Notes{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Focus on compound movements, I have a knee injury..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Generate Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating || muscleGroups.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Workout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right Column: Output (60%) ───────────────────────────────── */}
        <div className="lg:col-span-3" ref={outputRef}>
          <Card className="min-h-[500px] lg:min-h-[700px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Workout</CardTitle>
                {output && !isGenerating && (
                  <Badge variant="success">Complete</Badge>
                )}
                {isGenerating && (
                  <Badge variant="default">
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    Generating
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {!output && !isGenerating ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Your AI-generated workout will appear here
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Configure your preferences on the left and click &quot;Generate
                    Workout&quot; to get a personalized training plan.
                  </p>
                </div>
              ) : (
                /* Streaming output */
                <div className="relative">
                  <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {output}
                      {isGenerating && (
                        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Workout History                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10">
            <Dumbbell className="h-4.5 w-4.5 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Workouts</h2>
            <p className="text-sm text-muted-foreground">
              Your previously generated workout plans
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {savedWorkouts.map((workout) => {
            const isExpanded = expandedWorkout === workout.id;

            return (
              <Card
                key={workout.id}
                className="overflow-hidden transition-all duration-200 hover:border-primary/20"
              >
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-foreground">
                        {workout.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {workout.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFavorite(workout.id)}
                        className={cn(
                          "cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          workout.isFavorite
                            ? "bg-red-500/10 text-red-500"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={workout.isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {workout.duration} min
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        difficultyBadgeColor(workout.difficulty)
                      )}
                    >
                      {workout.difficulty}
                    </span>
                  </div>

                  {/* Muscle group badges */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {workout.muscleGroups.map((group) => (
                      <Badge key={group} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() =>
                      setExpandedWorkout(isExpanded ? null : workout.id)
                    }
                    className="cursor-pointer flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {isExpanded ? (
                      <>
                        Collapse <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        Expand Workout <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="mt-3 rounded-lg border border-border bg-background p-4">
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
                        {workout.content}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {savedWorkouts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Dumbbell className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-foreground">No saved workouts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate your first workout above to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
