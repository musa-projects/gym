"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/90" />
      </div>

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] h-16 w-16 rounded-2xl border border-white/10 bg-white/5"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-[15%] h-12 w-12 rounded-full border border-white/10 bg-white/5"
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [45, 50, 45] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-1/3 right-[25%] h-8 w-8 rotate-45 border border-white/10 bg-white/5"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          Ready To Start Your Transformation?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/80"
        >
          Join thousands who have already transformed their lives. Your first
          session is on us.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/free-trial"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-bold text-primary shadow-2xl shadow-black/20 transition-all hover:scale-105 hover:shadow-3xl"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/memberships"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
          >
            View Plans
          </a>
        </motion.div>
      </div>
    </section>
  );
}
