"use client";

import { useState } from "react";
import { ArrowLeft, Flame, TrendingDown, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Goal = "lose" | "maintain" | "gain";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very Active (2x/day)",
};

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    // Mifflin-St Jeor equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    let tdee = bmr * activityMultipliers[activity];
    if (goal === "lose") tdee -= 500;
    if (goal === "gain") tdee += 400;
    setResult(Math.round(tdee));
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link href="/nutrition" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Nutrition
        </Link>

        <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
          Calorie Calculator
        </h1>
        <p className="mt-3 text-muted-foreground">Find your daily calorie needs using the Mifflin-St Jeor equation.</p>

        <Card className="mt-8">
          <CardContent className="space-y-6 p-6">
            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Gender</label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={cn(
                      "flex-1 rounded-lg border py-3 text-sm font-medium capitalize transition-all cursor-pointer",
                      gender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age, Weight, Height */}
            {[
              { label: "Age", value: age, setter: setAge, unit: "years", min: 15, max: 80 },
              { label: "Weight", value: weight, setter: setWeight, unit: "kg", min: 30, max: 200 },
              { label: "Height", value: height, setter: setHeight, unit: "cm", min: 120, max: 230 },
            ].map(({ label, value, setter, unit, min, max }) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">{label}</label>
                  <span className="text-sm text-primary font-bold">{value} {unit}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            {/* Activity Level */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Activity Level</label>
              <div className="space-y-2">
                {(Object.keys(activityMultipliers) as ActivityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setActivity(level)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all cursor-pointer",
                      activity === level ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"
                    )}
                  >
                    {activityLabels[level]}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: "lose" as Goal, label: "Lose Fat", icon: TrendingDown },
                  { key: "maintain" as Goal, label: "Maintain", icon: Activity },
                  { key: "gain" as Goal, label: "Build Muscle", icon: TrendingUp },
                ]).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setGoal(key)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border py-4 text-xs font-medium transition-all cursor-pointer",
                      goal === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={calculate} className="w-full" size="lg">
              <Flame className="mr-2 h-5 w-5" /> Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Your Daily Calories</p>
                <p className="mt-2 font-[var(--font-oswald)] text-6xl font-bold text-foreground">{result.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">calories per day</p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-lg font-bold text-foreground">{Math.round(result * 0.3 / 4)}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-lg font-bold text-foreground">{Math.round(result * 0.4 / 4)}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="rounded-lg bg-card p-3">
                    <p className="text-lg font-bold text-foreground">{Math.round(result * 0.3 / 9)}g</p>
                    <p className="text-xs text-muted-foreground">Fats</p>
                  </div>
                </div>
                <Button className="mt-6" variant="outline" href="/free-trial">
                  Get a Personalized Nutrition Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
