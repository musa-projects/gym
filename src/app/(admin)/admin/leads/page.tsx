"use client";

import { useState, useCallback } from "react";
import {
  UserPlus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Search,
  Globe,
  Footprints,
  Users,
  Share2,
  Target,
  Eye,
  ChevronDown,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PipelineStage =
  | "new"
  | "contacted"
  | "toured"
  | "trial_scheduled"
  | "trial_done"
  | "negotiating"
  | "converted"
  | "lost";

type LeadSource = "Website" | "Walk-in" | "Referral" | "Social";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  score: number;
  pipeline_stage: PipelineStage;
  fitness_goal: string;
  created_days_ago: number;
}

// ---------------------------------------------------------------------------
// Pipeline stage config
// ---------------------------------------------------------------------------

const STAGES: {
  key: PipelineStage;
  label: string;
  color: string;
  barColor: string;
  bgColor: string;
}[] = [
  { key: "new", label: "New", color: "text-blue-400", barColor: "bg-blue-500", bgColor: "bg-blue-500/10" },
  { key: "contacted", label: "Contacted", color: "text-yellow-400", barColor: "bg-yellow-500", bgColor: "bg-yellow-500/10" },
  { key: "toured", label: "Toured", color: "text-purple-400", barColor: "bg-purple-500", bgColor: "bg-purple-500/10" },
  { key: "trial_scheduled", label: "Trial Scheduled", color: "text-orange-400", barColor: "bg-orange-500", bgColor: "bg-orange-500/10" },
  { key: "trial_done", label: "Trial Done", color: "text-cyan-400", barColor: "bg-cyan-500", bgColor: "bg-cyan-500/10" },
  { key: "negotiating", label: "Negotiating", color: "text-pink-400", barColor: "bg-pink-500", bgColor: "bg-pink-500/10" },
  { key: "converted", label: "Converted", color: "text-green-400", barColor: "bg-green-500", bgColor: "bg-green-500/10" },
  { key: "lost", label: "Lost", color: "text-gray-400", barColor: "bg-gray-500", bgColor: "bg-gray-500/10" },
];

// ---------------------------------------------------------------------------
// Source config
// ---------------------------------------------------------------------------

const SOURCE_CONFIG: Record<LeadSource, { icon: React.ElementType; color: string; bg: string }> = {
  Website: { icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
  "Walk-in": { icon: Footprints, color: "text-green-400", bg: "bg-green-500/10" },
  Referral: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  Social: { icon: Share2, color: "text-pink-400", bg: "bg-pink-500/10" },
};

// ---------------------------------------------------------------------------
// Mock data — 17 leads
// ---------------------------------------------------------------------------

const INITIAL_LEADS: Lead[] = [
  // New (5)
  { id: "lead_01", name: "James Wilson", email: "james.w@email.com", phone: "(555) 101-2001", source: "Website", score: 72, pipeline_stage: "new", fitness_goal: "Weight Loss", created_days_ago: 1 },
  { id: "lead_02", name: "Maria Garcia", email: "maria.garcia@email.com", phone: "(555) 101-2002", source: "Social", score: 55, pipeline_stage: "new", fitness_goal: "Muscle Gain", created_days_ago: 2 },
  { id: "lead_03", name: "Tyler Brooks", email: "tyler.b@email.com", phone: "(555) 101-2003", source: "Walk-in", score: 88, pipeline_stage: "new", fitness_goal: "General Fitness", created_days_ago: 0 },
  { id: "lead_04", name: "Samantha Lee", email: "sam.lee@email.com", phone: "(555) 101-2004", source: "Referral", score: 25, pipeline_stage: "new", fitness_goal: "Flexibility", created_days_ago: 5 },
  { id: "lead_05", name: "Derek Patel", email: "derek.p@email.com", phone: "(555) 101-2005", source: "Website", score: 41, pipeline_stage: "new", fitness_goal: "Strength Training", created_days_ago: 3 },
  // Contacted (3)
  { id: "lead_06", name: "Ashley Chen", email: "ashley.chen@email.com", phone: "(555) 202-3001", source: "Website", score: 65, pipeline_stage: "contacted", fitness_goal: "Weight Loss", created_days_ago: 4 },
  { id: "lead_07", name: "Brandon Miller", email: "brandon.m@email.com", phone: "(555) 202-3002", source: "Social", score: 38, pipeline_stage: "contacted", fitness_goal: "Boxing", created_days_ago: 6 },
  { id: "lead_08", name: "Nicole Foster", email: "nicole.f@email.com", phone: "(555) 202-3003", source: "Referral", score: 80, pipeline_stage: "contacted", fitness_goal: "CrossFit", created_days_ago: 3 },
  // Toured (2)
  { id: "lead_09", name: "Kevin Thompson", email: "kevin.t@email.com", phone: "(555) 303-4001", source: "Walk-in", score: 75, pipeline_stage: "toured", fitness_goal: "Muscle Gain", created_days_ago: 7 },
  { id: "lead_10", name: "Rachel Adams", email: "rachel.a@email.com", phone: "(555) 303-4002", source: "Website", score: 62, pipeline_stage: "toured", fitness_goal: "Yoga", created_days_ago: 5 },
  // Trial Scheduled (2)
  { id: "lead_11", name: "Marcus Johnson", email: "marcus.j@email.com", phone: "(555) 404-5001", source: "Referral", score: 85, pipeline_stage: "trial_scheduled", fitness_goal: "Strength Training", created_days_ago: 8 },
  { id: "lead_12", name: "Emily Rodriguez", email: "emily.r@email.com", phone: "(555) 404-5002", source: "Social", score: 52, pipeline_stage: "trial_scheduled", fitness_goal: "HIIT", created_days_ago: 6 },
  // Trial Done (1)
  { id: "lead_13", name: "David Kim", email: "david.kim@email.com", phone: "(555) 505-6001", source: "Walk-in", score: 90, pipeline_stage: "trial_done", fitness_goal: "General Fitness", created_days_ago: 10 },
  // Negotiating (1)
  { id: "lead_14", name: "Sophia Martinez", email: "sophia.m@email.com", phone: "(555) 606-7001", source: "Website", score: 78, pipeline_stage: "negotiating", fitness_goal: "Weight Loss", created_days_ago: 12 },
  // Converted (2)
  { id: "lead_15", name: "Ryan O'Brien", email: "ryan.ob@email.com", phone: "(555) 707-8001", source: "Referral", score: 95, pipeline_stage: "converted", fitness_goal: "Muscle Gain", created_days_ago: 15 },
  { id: "lead_16", name: "Jennifer Chang", email: "jen.chang@email.com", phone: "(555) 707-8002", source: "Walk-in", score: 82, pipeline_stage: "converted", fitness_goal: "CrossFit", created_days_ago: 14 },
  // Lost (1)
  { id: "lead_17", name: "Chris Taylor", email: "chris.t@email.com", phone: "(555) 808-9001", source: "Social", score: 18, pipeline_stage: "lost", fitness_goal: "General Fitness", created_days_ago: 20 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score < 30) return "bg-red-500";
  if (score <= 60) return "bg-yellow-500";
  return "bg-green-500";
}

function scoreTextColor(score: number): string {
  if (score < 30) return "text-red-400";
  if (score <= 60) return "text-yellow-400";
  return "text-green-400";
}

// ---------------------------------------------------------------------------
// Lead Card (for board view)
// ---------------------------------------------------------------------------

function LeadCard({ lead }: { lead: Lead }) {
  const srcCfg = SOURCE_CONFIG[lead.source];
  const SrcIcon = srcCfg.icon;

  return (
    <div className="rounded-xl border border-border bg-background p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Name + Score */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{lead.name}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={cn("h-2.5 w-2.5 rounded-full", scoreColor(lead.score))} />
          <span className={cn("text-xs font-bold", scoreTextColor(lead.score))}>{lead.score}</span>
        </div>
      </div>

      {/* Contact info */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3 shrink-0" />
          <span className="truncate">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
      </div>

      {/* Source + Goal + Days ago */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", srcCfg.bg, srcCfg.color)}>
          <SrcIcon className="h-2.5 w-2.5" />
          {lead.source}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {lead.created_days_ago === 0 ? "Today" : `${lead.created_days_ago}d ago`}
        </span>
      </div>

      {/* Fitness goal */}
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Target className="h-3 w-3 shrink-0 text-primary/60" />
        <span className="truncate">{lead.fitness_goal}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Board (Kanban)
// ---------------------------------------------------------------------------

function PipelineBoard({
  leads,
  onDragEnd,
}: {
  leads: Lead[];
  onDragEnd: (result: DropResult) => void;
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.pipeline_stage === stage.key);
          return (
            <div key={stage.key} className="flex w-[280px] shrink-0 flex-col">
              {/* Column header */}
              <div className="mb-3">
                <div className={cn("h-1.5 w-full rounded-t-lg", stage.barColor)} />
                <div className="flex items-center justify-between rounded-b-lg border border-t-0 border-border bg-card px-3 py-2.5">
                  <span className={cn("text-sm font-semibold", stage.color)}>{stage.label}</span>
                  <span className={cn("flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold", stage.bgColor, stage.color)}>
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Droppable column */}
              <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 space-y-2 rounded-xl border border-dashed border-border/50 p-2 transition-colors min-h-[120px]",
                      snapshot.isDraggingOver && "border-primary/40 bg-primary/5"
                    )}
                  >
                    {stageLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(snapshot.isDragging && "opacity-90 rotate-1")}
                          >
                            <LeadCard lead={lead} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

// ---------------------------------------------------------------------------
// List View
// ---------------------------------------------------------------------------

function LeadListView({ leads }: { leads: Lead[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => {
              const stage = STAGES.find((s) => s.key === lead.pipeline_stage)!;
              const srcCfg = SOURCE_CONFIG[lead.source];
              const SrcIcon = srcCfg.icon;
              return (
                <tr key={lead.id} className="transition-colors hover:bg-accent/30">
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-foreground">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{lead.email}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">{lead.phone}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", stage.bgColor, stage.color)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", stage.barColor)} />
                      {stage.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", srcCfg.bg, srcCfg.color)}>
                      <SrcIcon className="h-3 w-3" />
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <div className={cn("h-2 w-2 rounded-full", scoreColor(lead.score))} />
                      <span className={cn("text-sm font-bold", scoreTextColor(lead.score))}>{lead.score}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted-foreground">
                    {lead.created_days_ago === 0 ? "Today" : `${lead.created_days_ago}d ago`}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 cursor-pointer">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {leads.map((lead) => {
          const stage = STAGES.find((s) => s.key === lead.pipeline_stage)!;
          const srcCfg = SOURCE_CONFIG[lead.source];
          const SrcIcon = srcCfg.icon;
          return (
            <div key={lead.id} className="rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {lead.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2.5 w-2.5 rounded-full", scoreColor(lead.score))} />
                  <span className={cn("text-xs font-bold", scoreTextColor(lead.score))}>{lead.score}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", stage.bgColor, stage.color)}>
                  {stage.label}
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", srcCfg.bg, srcCfg.color)}>
                  <SrcIcon className="h-2.5 w-2.5" />
                  {lead.source}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {lead.created_days_ago === 0 ? "Today" : `${lead.created_days_ago}d ago`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3 text-primary/60" />
                  {lead.fitness_goal}
                </span>
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 cursor-pointer">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  // Handle drag end — move lead to new pipeline stage
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;

      // Dropped outside a valid droppable
      if (!destination) return;

      // Dropped in same position
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;

      setLeads((prev) => {
        const updated = prev.map((lead) =>
          lead.id === draggableId
            ? { ...lead, pipeline_stage: destination.droppableId as PipelineStage }
            : lead
        );

        return updated;
      });
    },
    []
  );

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !lead.name.toLowerCase().includes(q) &&
        !lead.email.toLowerCase().includes(q) &&
        !lead.phone.includes(q)
      )
        return false;
    }
    return true;
  });

  const totalLeads = leads.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-foreground">
            Leads Pipeline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalLeads} total leads across all stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-border bg-muted p-1">
            <button
              onClick={() => setView("board")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                view === "board"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Board view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                view === "list"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button variant="primary" size="sm">
            <UserPlus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as LeadSource | "all")}
            className="h-10 w-full appearance-none rounded-xl border border-border bg-muted pl-4 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-44 cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="Website">Website</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Referral">Referral</option>
            <option value="Social">Social</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Board or List View */}
      {view === "board" ? (
        <PipelineBoard leads={filteredLeads} onDragEnd={handleDragEnd} />
      ) : (
        <LeadListView leads={filteredLeads} />
      )}
    </div>
  );
}
