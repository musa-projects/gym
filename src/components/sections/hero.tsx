"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${8 + i * 11}%`,
  top: `${15 + (i % 4) * 20}%`,
  size: 4 + (i % 3) * 2,
  duration: 4 + i * 0.7,
  delay: i * 0.4,
}));

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Big Vision Gym interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated mesh blobs */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -30, 20, 0], y: [0, 40, -30, 0], scale: [1, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/8 blur-[100px]"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm bg-primary/20"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, rotate: "45deg" }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">
            #1 Premium Fitness Facility
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-[var(--font-oswald)] text-6xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Stronger
          <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent text-shimmer">
            Every Day
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Transform your body and mind at Big Vision Gym. Premium facilities,
          world-class trainers, and a community that pushes you to be your best.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-secondary opacity-50 blur-lg" />
            <Button size="lg" href="/free-trial" className="relative">
              Start Free Trial
            </Button>
          </div>
          <Button size="lg" variant="outline" href="/memberships">
            View Plans
          </Button>
          <Button size="lg" variant="ghost" href="/classes">
            Explore Classes
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
