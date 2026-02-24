"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Shield,
  Heart,
  Bell,
  MessageSquare,
  KeyRound,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface FitnessData {
  fitnessLevel: string;
  goals: string[];
  healthNotes: string;
}

interface SettingsData {
  emailNotifications: boolean;
  smsReminders: boolean;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const initialProfile: ProfileData = {
  fullName: "Marcus Johnson",
  email: "marcus.johnson@email.com",
  phone: "+1 (555) 987-6543",
  dateOfBirth: "1993-06-15",
  gender: "Male",
  emergencyContactName: "Sarah Johnson",
  emergencyContactPhone: "+1 (555) 123-4567",
};

const initialFitness: FitnessData = {
  fitnessLevel: "Intermediate",
  goals: ["Muscle Gain", "Endurance"],
  healthNotes: "Mild lower-back discomfort. Avoid heavy deadlifts.",
};

const initialSettings: SettingsData = {
  emailNotifications: true,
  smsReminders: false,
};

const fitnessGoalOptions = [
  "Weight Loss",
  "Muscle Gain",
  "Flexibility",
  "Endurance",
  "Stress Relief",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function InputField({
  label,
  icon: Icon,
  disabled,
  note,
  ...props
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  note?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </label>
      <input
        {...props}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
      {note && (
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  icon: Icon,
  options,
  ...props
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </label>
      <select
        {...props}
        className={cn(
          "w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

function Toggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [fitness, setFitness] = useState<FitnessData>(initialFitness);
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [updatingFitness, setUpdatingFitness] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch user email from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
        setProfile((prev) => ({ ...prev, email: user.email! }));
      }
    });
  }, []);

  const memberSince = "December 2025";

  // Get initials for avatar
  const initials = profile.fullName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleProfileSave = async () => {
    setSaving(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const handleFitnessUpdate = async () => {
    setUpdatingFitness(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUpdatingFitness(false);
  };

  const toggleGoal = (goal: string) => {
    setFitness((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Profile Header                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
              title="Change Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              {profile.fullName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userEmail || profile.email}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Personal Information Form                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground">
          Personal Information
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProfileSave();
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Full Name"
              icon={User}
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, fullName: e.target.value }))
              }
              placeholder="Your full name"
            />
            <InputField
              label="Email"
              icon={Mail}
              type="email"
              value={userEmail || profile.email}
              disabled
              note="Contact support to change your email"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Phone"
              icon={Phone}
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+1 (555) 000-0000"
            />
            <InputField
              label="Date of Birth"
              icon={Calendar}
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) =>
                setProfile((p) => ({ ...p, dateOfBirth: e.target.value }))
              }
            />
          </div>

          <SelectField
            label="Gender"
            icon={User}
            value={profile.gender}
            onChange={(e) =>
              setProfile((p) => ({ ...p, gender: e.target.value }))
            }
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
              { value: "Prefer not to say", label: "Prefer not to say" },
            ]}
          />

          {/* Emergency Contact */}
          <div className="border-t border-border pt-5">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Emergency Contact
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Contact Name"
                icon={Shield}
                type="text"
                value={profile.emergencyContactName}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    emergencyContactName: e.target.value,
                  }))
                }
                placeholder="Emergency contact name"
              />
              <InputField
                label="Contact Phone"
                icon={Phone}
                type="tel"
                value={profile.emergencyContactPhone}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    emergencyContactPhone: e.target.value,
                  }))
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Fitness Profile                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground">
          Fitness Profile
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFitnessUpdate();
          }}
          className="space-y-5"
        >
          <SelectField
            label="Fitness Level"
            icon={Heart}
            value={fitness.fitnessLevel}
            onChange={(e) =>
              setFitness((f) => ({ ...f, fitnessLevel: e.target.value }))
            }
            options={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
            ]}
          />

          {/* Goals checkboxes */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4 text-muted-foreground" />
              Goals
            </label>
            <div className="flex flex-wrap gap-2">
              {fitnessGoalOptions.map((goal) => {
                const selected = fitness.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Health notes */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Health Conditions / Notes
            </label>
            <textarea
              value={fitness.healthNotes}
              onChange={(e) =>
                setFitness((f) => ({ ...f, healthNotes: e.target.value }))
              }
              rows={3}
              placeholder="Any health conditions, injuries, or notes your trainer should know about..."
              className={cn(
                "w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors resize-none",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updatingFitness}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {updatingFitness ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updatingFitness ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Account Settings                                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground">
          Account Settings
        </h3>
        <div className="space-y-5">
          <Toggle
            label="Email Notifications"
            description="Receive class reminders and updates via email"
            enabled={settings.emailNotifications}
            onChange={(val) =>
              setSettings((s) => ({ ...s, emailNotifications: val }))
            }
          />

          <Toggle
            label="SMS Reminders"
            description="Get text message reminders before booked classes"
            enabled={settings.smsReminders}
            onChange={(val) =>
              setSettings((s) => ({ ...s, smsReminders: val }))
            }
          />

          <div className="border-t border-border pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">
                  Change your account password
                </p>
              </div>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Delete Account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
