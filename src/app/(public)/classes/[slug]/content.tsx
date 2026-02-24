"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Flame, Users, Dumbbell, Zap, Heart, Swords, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CLASS_TYPES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = { Flame, Dumbbell, Zap, Heart, Swords, Users };

type ClassData = (typeof CLASS_TYPES)[number];

export function ClassDetailContent({ classData }: { classData: ClassData }) {
  const Icon = iconMap[classData.icon] || Dumbbell;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/classes" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Classes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("rounded-2xl p-4", classData.bgColor, classData.color)}>
                <Icon className="h-10 w-10" />
              </div>
              <div>
                <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground md:text-5xl">
                  {classData.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{classData.difficulty}</Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> {classData.duration} min
                  </span>
                  <span className="text-sm text-muted-foreground">~{classData.calories} calories</span>
                </div>
              </div>
            </div>
            <Button size="lg" href="/free-trial">Try This Class Free</Button>
          </div>

          {/* Description */}
          <Card className="mt-8">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-muted-foreground">{classData.longDescription}</p>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-foreground">Benefits</h3>
                <ul className="space-y-3">
                  {classData.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-foreground">Equipment Used</h3>
                <div className="flex flex-wrap gap-2">
                  {classData.equipment.map((e) => (
                    <Badge key={e} variant="outline">{e}</Badge>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-bold text-foreground">Lead Trainer</h3>
                  <p className="text-muted-foreground">{classData.trainer}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
