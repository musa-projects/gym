"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/constants/testimonials";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () =>
    setCurrent((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const prevIndex =
    (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  const nextIndex = (current + 1) % TESTIMONIALS.length;

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background mesh blobs */}
      <div className="mesh-blob absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="mesh-blob absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Testimonials"
          title="Real People, Real Results"
          description="Don't take our word for it. Hear from the people who transformed their lives."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Avatar row with side previews */}
          <div className="mb-8 flex items-center justify-center gap-6">
            {/* Previous avatar */}
            <button
              onClick={prev}
              className="cursor-pointer transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full opacity-40 ring-1 ring-white/10 transition-opacity hover:opacity-70">
                <Image
                  src={TESTIMONIALS[prevIndex].avatar}
                  alt={TESTIMONIALS[prevIndex].name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </button>

            {/* Current avatar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/30 shadow-lg shadow-primary/10"
              >
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </motion.div>
            </AnimatePresence>

            {/* Next avatar */}
            <button
              onClick={next}
              className="cursor-pointer transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full opacity-40 ring-1 ring-white/10 transition-opacity hover:opacity-70">
                <Image
                  src={TESTIMONIALS[nextIndex].avatar}
                  alt={TESTIMONIALS[nextIndex].name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </button>
          </div>

          {/* Glassmorphism quote card */}
          <div className="glass relative rounded-2xl border border-[#262626] p-8 md:p-12">
            {/* Decorative gradient quote marks */}
            <div className="pointer-events-none absolute left-6 top-4 select-none">
              <Quote className="h-16 w-16 fill-primary/10 text-primary/10" />
            </div>
            <div className="pointer-events-none absolute bottom-4 right-6 rotate-180 select-none">
              <Quote className="h-16 w-16 fill-secondary/10 text-secondary/10" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative z-10 text-center"
              >
                <p className="text-lg leading-relaxed text-foreground/90 md:text-xl lg:text-2xl">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Star rating with glow */}
                <div className="mt-6 flex items-center justify-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-secondary text-secondary drop-shadow-[0_0_4px_rgba(249,115,22,0.5)]"
                    />
                  ))}
                </div>

                <p className="mt-4 font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#262626] text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Enhanced nav dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    i === current
                      ? "w-8 bg-gradient-to-r from-primary to-secondary shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      : "w-2 bg-[#262626] hover:bg-[#404040]"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#262626] text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
