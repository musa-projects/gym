import type { Metadata } from "next";
import Link from "next/link";
import { Utensils, ArrowRight, Clock, Calculator } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MEAL_PLANS, NUTRITION_BLOG_POSTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nutrition",
  description:
    "Fuel your fitness with Big Vision's nutrition plans, calorie calculator, and expert nutrition guidance.",
};

export default function NutritionPage() {
  return (
    <>
      <PageHeader
        label="Nutrition"
        title="Fuel Your Fire"
        description="Training is only half the battle. Fuel your body with the right nutrition to maximize results."
      />

      {/* Meal Plans */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground">
            Meal Plans
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {MEAL_PLANS.map((plan) => (
              <Card key={plan.name} className="overflow-hidden transition-all duration-300 hover:border-primary/50">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                  <Utensils className="h-16 w-16 text-primary/20" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
                    <span>{plan.calories} cal/day</span>
                    <span>&middot;</span>
                    <span>{plan.meals} meals/day</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {plan.highlights.map((h) => (
                      <Badge key={h} variant="outline" className="text-xs">{h}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 w-full">
                    Get This Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calorie Calculator CTA */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Calculator className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase text-foreground">
            Calorie Calculator
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find out exactly how many calories you need to reach your fitness goals.
          </p>
          <Button className="mt-6" href="/nutrition/calculator">
            Calculate Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground">
            Nutrition Blog
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {NUTRITION_BLOG_POSTS.map((post) => (
              <Card key={post.slug} className="group overflow-hidden transition-all duration-300 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{post.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
