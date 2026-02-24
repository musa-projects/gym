import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { buildWorkoutPrompt } from "@/lib/ai/workout-prompt";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { muscleGroups, duration, difficulty, equipment, workoutType, notes } =
      body;

    const prompt = buildWorkoutPrompt({
      muscleGroups: muscleGroups || [],
      duration: duration || 45,
      difficulty: difficulty || "intermediate",
      equipment: equipment || [],
      workoutType: workoutType || "general",
      notes,
    });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are an expert personal trainer. Generate detailed, safe, and effective workout plans. Always use proper markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI workout error:", error);
    return new Response("Failed to generate workout", { status: 500 });
  }
}
