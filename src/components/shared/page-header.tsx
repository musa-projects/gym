"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  label,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn("relative overflow-hidden bg-muted py-24", className)}
    >
      {/* Animated gradient mesh blobs */}
      <div
        className="mesh-blob absolute -top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="mesh-blob absolute -bottom-1/3 -left-1/4 h-[500px] w-[500px] rounded-full bg-secondary/8 blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="mesh-blob absolute top-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        style={{ animationDelay: "4s" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <span className="glass-light inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {label}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-[var(--font-oswald)] text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
