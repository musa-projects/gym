export function buildWorkoutPrompt(params: {
  muscleGroups: string[];
  duration: number;
  difficulty: string;
  equipment: string[];
  workoutType: string;
  notes?: string;
}) {
  return `You are an expert personal trainer at Big Vision Gym. Generate a detailed, structured workout plan based on these parameters:

**Target Muscle Groups:** ${params.muscleGroups.join(", ") || "Full Body"}
**Duration:** ${params.duration} minutes
**Difficulty Level:** ${params.difficulty}
**Available Equipment:** ${params.equipment.join(", ") || "Bodyweight only"}
**Workout Type:** ${params.workoutType}
${params.notes ? `**Additional Notes:** ${params.notes}` : ""}

Please provide the workout in this exact format:

## 🏋️ [Workout Title]

### Warm-Up (5 minutes)
- Exercise 1 — duration/reps
- Exercise 2 — duration/reps
- Exercise 3 — duration/reps

### Main Workout
For each exercise, provide:
- **Exercise Name** — Sets x Reps (or duration)
  - Rest: X seconds between sets
  - Form tip: brief technique cue

Group exercises into circuits or supersets where appropriate. Number each exercise.

### Cool-Down (5 minutes)
- Stretch 1 — duration
- Stretch 2 — duration
- Stretch 3 — duration

### 📊 Workout Summary
- Estimated calories burned: XXX
- Total exercises: XX
- Focus areas: list
- Intensity: low/medium/high

Keep it practical, motivating, and gym-appropriate. Use emojis sparingly for section headers only.`;
}
