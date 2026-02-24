export const MEAL_PLANS = [
  {
    name: "Fat Loss Plan",
    description: "Calorie-controlled meals designed to support fat loss while maintaining muscle mass.",
    calories: "1,800-2,200",
    meals: 5,
    highlights: ["High protein", "Moderate carbs", "Healthy fats", "Meal timing guidance"],
  },
  {
    name: "Muscle Building Plan",
    description: "Higher calorie, protein-rich meals to fuel muscle growth and recovery.",
    calories: "2,500-3,200",
    meals: 6,
    highlights: ["Extra protein", "Complex carbs", "Post-workout nutrition", "Caloric surplus"],
  },
  {
    name: "Balanced Wellness Plan",
    description: "Balanced approach for general health, energy, and sustainable nutrition habits.",
    calories: "2,000-2,500",
    meals: 4,
    highlights: ["Whole foods focused", "Balanced macros", "Flexible approach", "Sustainable habits"],
  },
] as const;

export const NUTRITION_BLOG_POSTS = [
  {
    slug: "protein-timing-myth",
    title: "The Protein Timing Myth: What Science Actually Says",
    excerpt: "Is there really an anabolic window? We break down the latest research on protein timing.",
    date: "2026-02-15",
    readTime: "5 min",
    category: "Science",
  },
  {
    slug: "meal-prep-beginners",
    title: "Meal Prep 101: A Beginner's Complete Guide",
    excerpt: "Save time and money while eating healthy. Our step-by-step guide to weekly meal prep.",
    date: "2026-02-08",
    readTime: "8 min",
    category: "Guides",
  },
  {
    slug: "best-pre-workout-foods",
    title: "10 Best Pre-Workout Foods for Maximum Performance",
    excerpt: "Fuel your training with the right foods at the right time for peak performance.",
    date: "2026-01-28",
    readTime: "4 min",
    category: "Nutrition",
  },
  {
    slug: "hydration-performance",
    title: "How Dehydration Kills Your Workout Performance",
    excerpt: "Even 2% dehydration can reduce performance by up to 25%. Here's how to stay optimal.",
    date: "2026-01-20",
    readTime: "6 min",
    category: "Science",
  },
] as const;
