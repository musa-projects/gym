"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Footprints,
  TrendingUp,
  Flame,
  Scale,
  Dumbbell,
  Heart,
  Activity,
  Brain,
  Zap,
  Sunrise,
  Sun,
  Sunset,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Crown,
  Star,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FitnessLevel = "beginner" | "intermediate" | "advanced";
type FitnessGoal =
  | "weight-loss"
  | "muscle-gain"
  | "endurance"
  | "flexibility"
  | "stress-relief"
  | "general-fitness";
type PreferredTime = "morning" | "afternoon" | "evening" | "flexible";
type Limitation =
  | "back-pain"
  | "knee-issues"
  | "shoulder-injury"
  | "heart-condition"
  | "asthma"
  | "pregnancy"
  | "none";

interface QuizAnswers {
  fitnessLevel: FitnessLevel | null;
  goal: FitnessGoal | null;
  frequency: number | null;
  preferredTime: PreferredTime | null;
  limitations: Limitation[];
  healthNotes: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FITNESS_LEVELS: {
  value: FitnessLevel;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to fitness or returning after a long break",
    icon: Footprints,
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Regular exercise for 6+ months",
    icon: TrendingUp,
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Experienced athlete, 2+ years consistent training",
    icon: Flame,
  },
];

const GOALS: {
  value: FitnessGoal;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "weight-loss", label: "Weight Loss", icon: Scale },
  { value: "muscle-gain", label: "Muscle Gain", icon: Dumbbell },
  { value: "endurance", label: "Endurance", icon: Heart },
  { value: "flexibility", label: "Flexibility", icon: Activity },
  { value: "stress-relief", label: "Stress Relief", icon: Brain },
  { value: "general-fitness", label: "General Fitness", icon: Zap },
];

const PREFERRED_TIMES: {
  value: PreferredTime;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "morning",
    label: "Morning",
    description: "5AM - 11AM",
    icon: Sunrise,
  },
  {
    value: "afternoon",
    label: "Afternoon",
    description: "11AM - 4PM",
    icon: Sun,
  },
  {
    value: "evening",
    label: "Evening",
    description: "4PM - 9PM",
    icon: Sunset,
  },
  {
    value: "flexible",
    label: "Flexible",
    description: "Any time works",
    icon: Clock,
  },
];

const LIMITATIONS: { value: Limitation; label: string }[] = [
  { value: "back-pain", label: "Back Pain" },
  { value: "knee-issues", label: "Knee Issues" },
  { value: "shoulder-injury", label: "Shoulder Injury" },
  { value: "heart-condition", label: "Heart Condition" },
  { value: "asthma", label: "Asthma" },
  { value: "pregnancy", label: "Pregnancy" },
  { value: "none", label: "None" },
];

const STEP_LABELS = [
  "Fitness Level",
  "Primary Goal",
  "Frequency",
  "Preferred Time",
  "Health",
];

// ---------------------------------------------------------------------------
// Recommendation helpers
// ---------------------------------------------------------------------------

function getRecommendedPlan(frequency: number | null) {
  if (!frequency) return null;
  if (frequency <= 2)
    return {
      name: "Basic",
      price: "$29/mo",
      badge: "starter" as const,
      features: [
        "Gym floor access",
        "2 group classes/week",
        "Locker room access",
        "Basic fitness assessment",
      ],
    };
  if (frequency <= 4)
    return {
      name: "Premium",
      price: "$59/mo",
      badge: "popular" as const,
      features: [
        "Unlimited group classes",
        "Sauna & steam room",
        "Nutrition guidance",
        "Monthly body scan",
      ],
    };
  return {
    name: "VIP",
    price: "$99/mo",
    badge: "elite" as const,
    features: [
      "Everything in Premium",
      "2 personal training sessions/mo",
      "Priority class booking",
      "Recovery zone access",
    ],
  };
}

function getFrequencyRecommendation(frequency: number | null) {
  if (!frequency) return null;
  if (frequency <= 2)
    return "We recommend starting with our Basic plan";
  if (frequency <= 4)
    return "Perfect for our Premium plan with group classes";
  return "You're dedicated! Our VIP plan is ideal";
}

const GOAL_CLASSES: Record<
  FitnessGoal,
  { name: string; category: string; color: string; bg: string }[]
> = {
  "weight-loss": [
    { name: "HIIT Blast", category: "HIIT", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Boxing Conditioning", category: "Boxing", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Cardio Kickstart", category: "Cardio", color: "text-pink-500", bg: "bg-pink-500/10" },
  ],
  "muscle-gain": [
    { name: "Strength Fundamentals", category: "Strength", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "CrossFit WOD", category: "CrossFit", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "Hypertrophy Training", category: "Strength", color: "text-orange-500", bg: "bg-orange-500/10" },
  ],
  endurance: [
    { name: "Cardio Kickstart", category: "Cardio", color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "CrossFit Endurance", category: "CrossFit", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "HIIT Blast", category: "HIIT", color: "text-red-500", bg: "bg-red-500/10" },
  ],
  flexibility: [
    { name: "Sunrise Yoga Flow", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Power Yoga", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Yin Yoga", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
  ],
  "stress-relief": [
    { name: "Restorative Yoga", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Yin Yoga", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Vinyasa Yoga", category: "Yoga", color: "text-green-500", bg: "bg-green-500/10" },
  ],
  "general-fitness": [
    { name: "CrossFit WOD", category: "CrossFit", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "HIIT Blast", category: "HIIT", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Strength & Power", category: "Strength", color: "text-orange-500", bg: "bg-orange-500/10" },
  ],
};

const GOAL_TRAINERS: Record<
  FitnessGoal,
  { name: string; specialty: string; image: string }
> = {
  "weight-loss": {
    name: "Sarah Williams",
    specialty: "HIIT & Fat Loss Specialist",
    image: "SW",
  },
  "muscle-gain": {
    name: "Marcus Chen",
    specialty: "Strength & Hypertrophy Coach",
    image: "MC",
  },
  endurance: {
    name: "Nina Kowalski",
    specialty: "Endurance & Cardio Expert",
    image: "NK",
  },
  flexibility: {
    name: "Aisha Patel",
    specialty: "Yoga & Mobility Instructor",
    image: "AP",
  },
  "stress-relief": {
    name: "Aisha Patel",
    specialty: "Yoga & Mindfulness Coach",
    image: "AP",
  },
  "general-fitness": {
    name: "Jake Morrison",
    specialty: "General Fitness & CrossFit",
    image: "JM",
  },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeeklySchedule(
  goal: FitnessGoal,
  frequency: number,
  preferredTime: PreferredTime
) {
  const classes = GOAL_CLASSES[goal];
  const timeSlot =
    preferredTime === "morning"
      ? "7:00 AM"
      : preferredTime === "afternoon"
        ? "12:00 PM"
        : preferredTime === "evening"
          ? "6:00 PM"
          : "7:00 AM";

  const schedule: (null | { name: string; time: string })[] = Array(7).fill(
    null
  );

  // Distribute workout days evenly across the week
  const dayIndices: number[] = [];
  if (frequency >= 1) dayIndices.push(0); // Mon
  if (frequency >= 2) dayIndices.push(2); // Wed
  if (frequency >= 3) dayIndices.push(4); // Fri
  if (frequency >= 4) dayIndices.push(1); // Tue
  if (frequency >= 5) dayIndices.push(3); // Thu
  if (frequency >= 6) dayIndices.push(5); // Sat
  if (frequency >= 7) dayIndices.push(6); // Sun

  dayIndices.slice(0, frequency).forEach((dayIdx, i) => {
    schedule[dayIdx] = {
      name: classes[i % classes.length].name,
      time: timeSlot,
    };
  });

  return schedule;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 5;

export default function OnboardingQuizPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    fitnessLevel: null,
    goal: null,
    frequency: null,
    preferredTime: null,
    limitations: [],
    healthNotes: "",
  });
  const [showResults, setShowResults] = useState(false);

  // ---- Validation ----
  const isStepComplete = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return answers.fitnessLevel !== null;
        case 2:
          return answers.goal !== null;
        case 3:
          return answers.frequency !== null;
        case 4:
          return answers.preferredTime !== null;
        case 5:
          return answers.limitations.length > 0;
        default:
          return false;
      }
    },
    [answers]
  );

  // ---- Navigation ----
  const goToStep = useCallback(
    (step: number) => {
      if (step === currentStep || isAnimating) return;
      setDirection(step > currentStep ? "forward" : "backward");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(step);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
    },
    [currentStep, isAnimating]
  );

  const handleNext = useCallback(() => {
    if (currentStep === TOTAL_STEPS) {
      setDirection("forward");
      setIsAnimating(true);
      setTimeout(() => {
        setShowResults(true);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
      return;
    }
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const handleBack = useCallback(() => {
    if (showResults) {
      setDirection("backward");
      setIsAnimating(true);
      setTimeout(() => {
        setShowResults(false);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
      return;
    }
    if (currentStep > 1) goToStep(currentStep - 1);
  }, [currentStep, showResults, goToStep]);

  const handleRetake = useCallback(() => {
    setDirection("backward");
    setIsAnimating(true);
    setTimeout(() => {
      setAnswers({
        fitnessLevel: null,
        goal: null,
        frequency: null,
        preferredTime: null,
        limitations: [],
        healthNotes: "",
      });
      setCurrentStep(1);
      setShowResults(false);
      setTimeout(() => setIsAnimating(false), 50);
    }, 200);
  }, []);

  // ---- Limitation toggle ----
  const toggleLimitation = useCallback((lim: Limitation) => {
    setAnswers((prev) => {
      if (lim === "none") {
        return { ...prev, limitations: prev.limitations.includes("none") ? [] : ["none"] };
      }
      const without = prev.limitations.filter((l) => l !== "none");
      if (without.includes(lim)) {
        return { ...prev, limitations: without.filter((l) => l !== lim) };
      }
      return { ...prev, limitations: [...without, lim] };
    });
  }, []);

  // ---- Results data ----
  const plan = useMemo(
    () => getRecommendedPlan(answers.frequency),
    [answers.frequency]
  );
  const trainer = useMemo(
    () => (answers.goal ? GOAL_TRAINERS[answers.goal] : null),
    [answers.goal]
  );
  const recommendedClasses = useMemo(
    () => (answers.goal ? GOAL_CLASSES[answers.goal] : []),
    [answers.goal]
  );
  const weeklySchedule = useMemo(
    () =>
      answers.goal && answers.frequency && answers.preferredTime
        ? getWeeklySchedule(
            answers.goal,
            answers.frequency,
            answers.preferredTime
          )
        : Array(7).fill(null),
    [answers.goal, answers.frequency, answers.preferredTime]
  );

  // ---- Animation class ----
  const animClass = isAnimating
    ? "opacity-0 translate-y-3"
    : "opacity-100 translate-y-0";

  // ====================================================================
  // RESULTS PAGE
  // ====================================================================
  if (showResults) {
    return (
      <div className="mx-auto max-w-[700px] space-y-6 pb-12">
        <div
          className={cn(
            "transition-all duration-300 ease-out space-y-6",
            animClass
          )}
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-[var(--font-oswald)] text-3xl font-bold text-foreground sm:text-4xl">
              Your Personalized Plan
            </h1>
            <p className="mt-2 text-muted-foreground">
              Based on your answers, here is what we recommend for you.
            </p>
          </div>

          {/* Recommended Plan */}
          {plan && (
            <Card className="relative overflow-hidden">
              {plan.badge === "elite" && (
                <div className="absolute right-4 top-4">
                  <Badge variant="default">
                    <Crown className="mr-1 h-3 w-3" />
                    Elite
                  </Badge>
                </div>
              )}
              {plan.badge === "popular" && (
                <div className="absolute right-4 top-4">
                  <Badge variant="secondary">
                    <Star className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardDescription>Recommended Plan</CardDescription>
                <CardTitle className="font-[var(--font-oswald)] text-2xl">
                  {plan.name} Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-3xl font-bold text-primary">
                  {plan.price}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommended Classes */}
          <div>
            <h2 className="mb-3 font-[var(--font-oswald)] text-xl font-bold text-foreground">
              Recommended Classes
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recommendedClasses.map((cls) => (
                <Card key={cls.name} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        cls.bg
                      )}
                    >
                      <Dumbbell className={cn("h-5 w-5", cls.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {cls.name}
                      </p>
                      <p className={cn("text-xs font-medium", cls.color)}>
                        {cls.category}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended Trainer */}
          {trainer && (
            <div>
              <h2 className="mb-3 font-[var(--font-oswald)] text-xl font-bold text-foreground">
                Recommended Trainer
              </h2>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {trainer.image}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {trainer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {trainer.specialty}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Weekly Schedule */}
          <div>
            <h2 className="mb-3 font-[var(--font-oswald)] text-xl font-bold text-foreground">
              Weekly Schedule Suggestion
            </h2>
            <Card className="p-4 sm:p-5">
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {DAY_LABELS.map((day, i) => {
                  const session = weeklySchedule[i];
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex flex-col items-center rounded-xl px-1 py-3 text-center transition-colors sm:px-2",
                        session
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase sm:text-xs",
                          session
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {day}
                      </span>
                      {session ? (
                        <>
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                          <p className="mt-1 hidden text-[10px] leading-tight text-foreground sm:block">
                            {session.name.split(" ")[0]}
                          </p>
                          <p className="mt-0.5 hidden text-[9px] text-muted-foreground sm:block">
                            {session.time}
                          </p>
                        </>
                      ) : (
                        <div className="mt-1.5 text-[10px] text-muted-foreground sm:text-xs">
                          Rest
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button size="lg" href="/dashboard/book-class" className="w-full sm:w-auto">
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
            <button
              onClick={handleRetake}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================
  // QUIZ STEPS
  // ====================================================================
  return (
    <div className="mx-auto max-w-[700px] space-y-6 pb-12">
      {/* ---- Progress bar ---- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {STEP_LABELS[currentStep - 1]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* ---- Step content ---- */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          animClass
        )}
      >
        {/* ========================= STEP 1 ========================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-[var(--font-oswald)] text-2xl font-bold text-foreground sm:text-3xl">
                What&apos;s your current fitness level?
              </h1>
              <p className="mt-2 text-muted-foreground">
                This helps us tailor recommendations to where you are now.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FITNESS_LEVELS.map((level) => {
                const isSelected = answers.fitnessLevel === level.value;
                return (
                  <button
                    key={level.value}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        fitnessLevel: level.value,
                      }))
                    }
                    className={cn(
                      "group flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30 hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <level.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-base font-bold transition-colors",
                          isSelected
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {level.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================= STEP 2 ========================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-[var(--font-oswald)] text-2xl font-bold text-foreground sm:text-3xl">
                What&apos;s your primary fitness goal?
              </h1>
              <p className="mt-2 text-muted-foreground">
                We will build your plan around this.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GOALS.map((g) => {
                const isSelected = answers.goal === g.value;
                return (
                  <button
                    key={g.value}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        goal: g.value,
                      }))
                    }
                    className={cn(
                      "group flex flex-col items-center gap-2.5 rounded-2xl border-2 p-5 text-center transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30 hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <g.icon className="h-6 w-6" />
                    </div>
                    <p
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {g.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================= STEP 3 ========================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-[var(--font-oswald)] text-2xl font-bold text-foreground sm:text-3xl">
                How many days per week can you train?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Be realistic -- consistency beats intensity.
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const day = i + 1;
                const isSelected = answers.frequency === day;
                return (
                  <button
                    key={day}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        frequency: day,
                      }))
                    }
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold transition-all duration-200 sm:h-14 sm:w-14 sm:text-lg",
                      isSelected
                        ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110"
                        : "border-2 border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {answers.frequency && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  {getFrequencyRecommendation(answers.frequency)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================= STEP 4 ========================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-[var(--font-oswald)] text-2xl font-bold text-foreground sm:text-3xl">
                When do you prefer to work out?
              </h1>
              <p className="mt-2 text-muted-foreground">
                We will suggest classes that fit your schedule.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PREFERRED_TIMES.map((t) => {
                const isSelected = answers.preferredTime === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        preferredTime: t.value,
                      }))
                    }
                    className={cn(
                      "group flex flex-col items-center gap-2.5 rounded-2xl border-2 p-5 text-center transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30 hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <t.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {t.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================= STEP 5 ========================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-[var(--font-oswald)] text-2xl font-bold text-foreground sm:text-3xl">
                Any limitations we should know about?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Select all that apply so we can keep you safe.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {LIMITATIONS.map((lim) => {
                const isSelected = answers.limitations.includes(lim.value);
                return (
                  <button
                    key={lim.value}
                    onClick={() => toggleLimitation(lim.value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {isSelected && (
                      <Check className="mr-1.5 inline h-3.5 w-3.5" />
                    )}
                    {lim.label}
                  </button>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="health-notes"
                className="mb-2 block text-sm font-medium text-muted-foreground"
              >
                Additional health notes (optional)
              </label>
              <textarea
                id="health-notes"
                rows={3}
                placeholder="Any other health information your trainers should know..."
                value={answers.healthNotes}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    healthNotes: e.target.value,
                  }))
                }
                className="w-full resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---- Navigation ---- */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={cn(currentStep === 1 && "invisible")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isStepComplete(currentStep)}
        >
          {currentStep === TOTAL_STEPS ? "See My Results" : "Next"}
          {currentStep === TOTAL_STEPS ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
