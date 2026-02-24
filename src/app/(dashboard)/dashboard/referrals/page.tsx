"use client";

import { useState } from "react";
import {
  Gift,
  Copy,
  Share2,
  Check,
  Users,
  UserPlus,
  DollarSign,
  Crown,
  MessageCircle,
  Mail,
  Link2,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReferralStatus = "pending" | "signed_up" | "subscribed" | "rewarded";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: ReferralStatus;
  reward: string | null;
  date: Date;
}

interface PendingReward {
  id: string;
  label: string;
  description: string;
  earnedDate: Date;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const REFERRAL_CODE = "BIGVISION-ALEX7";
const REFERRAL_LINK = `https://bigvisiongym.com/referral?code=${REFERRAL_CODE}`;

const MOCK_REFERRALS: Referral[] = [
  {
    id: "ref_001",
    name: "Jordan Mitchell",
    email: "jordan.m@email.com",
    status: "rewarded",
    reward: "10% off monthly",
    date: new Date(2025, 8, 12),
  },
  {
    id: "ref_002",
    name: "Samantha Lee",
    email: "sam.lee@email.com",
    status: "subscribed",
    reward: "10% off monthly",
    date: new Date(2025, 9, 3),
  },
  {
    id: "ref_003",
    name: "Marcus Brown",
    email: "m.brown@email.com",
    status: "subscribed",
    reward: "Free month (pending)",
    date: new Date(2025, 10, 18),
  },
  {
    id: "ref_004",
    name: "Priya Patel",
    email: "priya.p@email.com",
    status: "signed_up",
    reward: null,
    date: new Date(2025, 11, 5),
  },
  {
    id: "ref_005",
    name: "David Chen",
    email: "d.chen@email.com",
    status: "signed_up",
    reward: null,
    date: new Date(2026, 0, 14),
  },
  {
    id: "ref_006",
    name: "Aisha Williams",
    email: "aisha.w@email.com",
    status: "subscribed",
    reward: "Free month (pending)",
    date: new Date(2026, 0, 22),
  },
  {
    id: "ref_007",
    name: "Tyler Rodriguez",
    email: "tyler.r@email.com",
    status: "pending",
    reward: null,
    date: new Date(2026, 1, 2),
  },
  {
    id: "ref_008",
    name: "Emma Nakamura",
    email: "emma.n@email.com",
    status: "pending",
    reward: null,
    date: new Date(2026, 1, 18),
  },
];

const MOCK_PENDING_REWARDS: PendingReward[] = [
  {
    id: "rw_001",
    label: "1 Free Month",
    description: "Earned for reaching 3 successful referrals",
    earnedDate: new Date(2025, 10, 18),
  },
  {
    id: "rw_002",
    label: "Free Merch Pack",
    description: "Earned for reaching 5 successful referrals",
    earnedDate: new Date(2026, 0, 22),
  },
];

const REWARD_TIERS = [
  {
    threshold: 1,
    label: "10% off next month",
    icon: DollarSign,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    threshold: 3,
    label: "1 free month",
    icon: Gift,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    threshold: 5,
    label: "Free merch pack",
    icon: Trophy,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    threshold: 10,
    label: "VIP upgrade for 3 months",
    icon: Crown,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ReferralStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    dot: "bg-yellow-500",
  },
  signed_up: {
    label: "Signed Up",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    dot: "bg-blue-500",
  },
  subscribed: {
    label: "Subscribed",
    bg: "bg-green-500/10",
    text: "text-green-500",
    dot: "bg-green-500",
  },
  rewarded: {
    label: "Rewarded",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    dot: "bg-purple-500",
  },
};

function StatusBadge({ status }: { status: ReferralStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.bg,
        cfg.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconColor,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referral Code Card
// ---------------------------------------------------------------------------

function ReferralCodeCard() {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } else {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const message = `Join me at Big Vision Gym! Use my referral code ${REFERRAL_CODE} or sign up here: ${REFERRAL_LINK}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const shareSMS = () => {
    const message = `Join me at Big Vision Gym! Use my referral code ${REFERRAL_CODE} or sign up here: ${REFERRAL_LINK}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const shareEmail = () => {
    const subject = "Join me at Big Vision Gym!";
    const body = `Hey! I've been training at Big Vision Gym and it's been amazing. Use my referral code ${REFERRAL_CODE} to get started, or sign up directly here: ${REFERRAL_LINK}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Share2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Your Referral Code
          </h2>
          <p className="text-sm text-muted-foreground">
            Share with friends and earn rewards together
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 rounded-xl border border-border bg-muted px-5 py-3.5">
          <p className="font-[var(--font-oswald)] text-2xl font-bold tracking-wider text-foreground">
            {REFERRAL_CODE}
          </p>
        </div>
        <button
          onClick={() => copyToClipboard(REFERRAL_CODE, "code")}
          className={cn(
            "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 transition-all cursor-pointer",
            codeCopied
              ? "border-green-500 bg-green-500/10 text-green-500"
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          {codeCopied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Shareable Link */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Shareable Link
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {REFERRAL_LINK}
          </span>
          <button
            onClick={() => copyToClipboard(REFERRAL_LINK, "link")}
            className={cn(
              "shrink-0 text-xs font-semibold transition-colors cursor-pointer",
              linkCopied
                ? "text-green-500"
                : "text-primary hover:text-red-300",
            )}
          >
            {linkCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={shareWhatsApp}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600/10 px-4 py-3 text-sm font-semibold text-green-500 transition-colors hover:bg-green-600/20 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
        <button
          onClick={shareSMS}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600/10 px-4 py-3 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-600/20 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          SMS
        </button>
        <button
          onClick={shareEmail}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600/10 px-4 py-3 text-sm font-semibold text-purple-400 transition-colors hover:bg-purple-600/20 cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          onClick={() => copyToClipboard(REFERRAL_LINK, "link")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 cursor-pointer"
        >
          <Link2 className="h-4 w-4" />
          Copy Link
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reward Tiers
// ---------------------------------------------------------------------------

function RewardTiersSection() {
  // Count "successful" referrals (subscribed or rewarded)
  const successfulCount = MOCK_REFERRALS.filter(
    (r) => r.status === "subscribed" || r.status === "rewarded",
  ).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
          <Trophy className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Reward Tiers</h2>
          <p className="text-sm text-muted-foreground">
            Unlock rewards as you refer more friends
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REWARD_TIERS.map((tier) => {
          const unlocked = successfulCount >= tier.threshold;
          const TierIcon = tier.icon;

          return (
            <div
              key={tier.threshold}
              className={cn(
                "relative rounded-xl border p-5 transition-all",
                unlocked
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-muted/30",
              )}
            >
              {unlocked && (
                <div className="absolute top-3 right-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                  tier.bgColor,
                )}
              >
                <TierIcon className={cn("h-5 w-5", tier.color)} />
              </div>

              <p className="mb-1 text-sm font-bold text-foreground">
                {tier.threshold}{" "}
                {tier.threshold === 1 ? "Referral" : "Referrals"}
              </p>
              <p
                className={cn(
                  "text-sm",
                  unlocked ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {tier.label}
              </p>

              {/* Progress indicator */}
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      unlocked
                        ? "bg-primary"
                        : "bg-muted-foreground/30",
                    )}
                    style={{
                      width: `${Math.min((successfulCount / tier.threshold) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {unlocked
                    ? "Unlocked"
                    : `${successfulCount}/${tier.threshold} referrals`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referral History Table
// ---------------------------------------------------------------------------

function ReferralHistoryTable() {
  const sorted = [...MOCK_REFERRALS].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Referral History
            </h2>
            <p className="text-sm text-muted-foreground">
              Track the status of everyone you&apos;ve referred
            </p>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reward
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((referral) => (
              <tr
                key={referral.id}
                className="transition-colors hover:bg-accent/30"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {referral.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {referral.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={referral.status} />
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {referral.reward || (
                    <span className="text-muted-foreground/40">--</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-muted-foreground">
                  {formatDate(referral.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 p-4 md:hidden">
        {sorted.map((referral) => (
          <div
            key={referral.id}
            className="rounded-xl border border-border bg-muted/30 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {referral.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {referral.email}
                </p>
              </div>
              <StatusBadge status={referral.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {referral.reward || "No reward yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(referral.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pending Rewards Card
// ---------------------------------------------------------------------------

function PendingRewardsCard() {
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const handleClaim = (id: string) => {
    setClaimedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
          <Gift className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Pending Rewards
          </h2>
          <p className="text-sm text-muted-foreground">
            Claim your earned rewards below
          </p>
        </div>
      </div>

      {MOCK_PENDING_REWARDS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Gift className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            No pending rewards
          </p>
          <p className="text-xs text-muted-foreground/60">
            Keep referring friends to earn rewards!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_PENDING_REWARDS.map((reward) => {
            const claimed = claimedIds.has(reward.id);

            return (
              <div
                key={reward.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-xl border p-4 transition-all",
                  claimed
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border bg-muted/30",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      claimed ? "text-green-500" : "text-foreground",
                    )}
                  >
                    {claimed ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        {reward.label} - Claimed!
                      </span>
                    ) : (
                      reward.label
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {reward.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    Earned {formatDate(reward.earnedDate)}
                  </p>
                </div>

                {!claimed && (
                  <button
                    onClick={() => handleClaim(reward.id)}
                    className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-red-600 hover:shadow-primary/40 cursor-pointer"
                  >
                    Claim
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReferralsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
          Referral Program
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite friends to Big Vision Gym and earn exclusive rewards for every
          successful referral.
        </p>
      </div>

      {/* Referral Code Card */}
      <ReferralCodeCard />

      {/* Stats cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Referrals"
          value={8}
          icon={UserPlus}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          label="Signed Up"
          value={5}
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Active Members"
          value={3}
          icon={Check}
          iconColor="bg-green-500/10 text-green-400"
        />
        <StatCard
          label="Rewards Earned"
          value="$150"
          icon={DollarSign}
          iconColor="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      {/* Reward Tiers */}
      <RewardTiersSection />

      {/* Referral History */}
      <ReferralHistoryTable />

      {/* Pending Rewards */}
      <PendingRewardsCard />
    </div>
  );
}
