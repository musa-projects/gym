import type { Metadata } from "next";
import { CalorieCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Calorie Calculator",
  description: "Calculate your daily calorie needs based on your goals, activity level, and body stats.",
};

export default function CalorieCalculatorPage() {
  return <CalorieCalculator />;
}
