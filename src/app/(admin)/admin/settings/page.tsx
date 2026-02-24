"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Bell,
  BellRing,
  CreditCard,
  AlertTriangle,
  UserPlus,
  CalendarCheck,
  Shield,
  KeyRound,
  FileText,
  Download,
  RotateCcw,
  Save,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GymInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
}

interface NotificationSettings {
  newMemberSignup: boolean;
  newBooking: boolean;
  paymentFailure: boolean;
  lowCapacity: boolean;
  leadInquiry: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const initialGymInfo: GymInfo = {
  name: "Big Vision Gym",
  tagline: "Transform Your Body, Elevate Your Mind",
  email: "info@bigvisiongym.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fitness Boulevard, Los Angeles, CA 90001",
  weekdayOpen: "05:00",
  weekdayClose: "22:00",
  weekendOpen: "07:00",
  weekendClose: "20:00",
};

const initialNotifications: NotificationSettings = {
  newMemberSignup: true,
  newBooking: true,
  paymentFailure: true,
  lowCapacity: false,
  leadInquiry: true,
};

const initialSecurity: SecuritySettings = {
  twoFactor: false,
  sessionTimeout: "30",
};

// ---------------------------------------------------------------------------
// Toggle component (matching profile page pattern)
// ---------------------------------------------------------------------------

function Toggle({
  label,
  description,
  icon: Icon,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          enabled ? "bg-primary" : "bg-border"
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
// Input field helper
// ---------------------------------------------------------------------------

function InputField({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </label>
      <input
        {...props}
        className={cn(
          "w-full rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        )}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSettingsPage() {
  const [gymInfo, setGymInfo] = useState<GymInfo>(initialGymInfo);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [security, setSecurity] = useState<SecuritySettings>(initialSecurity);
  const [savingGymInfo, setSavingGymInfo] = useState(false);

  const handleSaveGymInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGymInfo(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSavingGymInfo(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* ----------------------------------------------------------------- */}
      {/* Page Header                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h1 className="font-[var(--font-oswald)] text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage gym information, notifications, and security preferences.
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Gym Information                                                   */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Gym Information</CardTitle>
              <CardDescription>
                Basic details about your gym displayed across the platform.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveGymInfo} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Gym Name"
                icon={Building2}
                type="text"
                value={gymInfo.name}
                onChange={(e) =>
                  setGymInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your gym name"
              />
              <InputField
                label="Tagline"
                icon={FileText}
                type="text"
                value={gymInfo.tagline}
                onChange={(e) =>
                  setGymInfo((prev) => ({ ...prev, tagline: e.target.value }))
                }
                placeholder="Your gym tagline"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Email"
                icon={Mail}
                type="email"
                value={gymInfo.email}
                onChange={(e) =>
                  setGymInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="contact@yourgym.com"
              />
              <InputField
                label="Phone"
                icon={Phone}
                type="tel"
                value={gymInfo.phone}
                onChange={(e) =>
                  setGymInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <InputField
              label="Address"
              icon={MapPin}
              type="text"
              value={gymInfo.address}
              onChange={(e) =>
                setGymInfo((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Full address"
            />

            {/* Operating Hours */}
            <div className="border-t border-border pt-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Operating Hours
              </p>

              <div className="space-y-4">
                {/* Weekday Hours */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Weekdays (Mon - Fri)
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={gymInfo.weekdayOpen}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          weekdayOpen: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={gymInfo.weekdayClose}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          weekdayClose: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Weekend Hours */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Weekends (Sat - Sun)
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={gymInfo.weekendOpen}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          weekendOpen: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={gymInfo.weekendClose}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          weekendClose: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingGymInfo}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                {savingGymInfo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savingGymInfo ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Notification Settings                                             */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Bell className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
              <CardDescription>
                Choose which events trigger admin notifications.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <Toggle
              label="New Member Signups"
              description="Get notified when a new member creates an account"
              icon={UserPlus}
              enabled={notifications.newMemberSignup}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, newMemberSignup: val }))
              }
            />

            <div className="border-t border-border" />

            <Toggle
              label="New Booking Notifications"
              description="Get notified when a member books a class"
              icon={CalendarCheck}
              enabled={notifications.newBooking}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, newBooking: val }))
              }
            />

            <div className="border-t border-border" />

            <Toggle
              label="Payment Failure Alerts"
              description="Get alerted when a payment fails or is declined"
              icon={CreditCard}
              enabled={notifications.paymentFailure}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, paymentFailure: val }))
              }
            />

            <div className="border-t border-border" />

            <Toggle
              label="Low Capacity Warnings"
              description="Get warned when class enrollment drops below 30%"
              icon={AlertTriangle}
              enabled={notifications.lowCapacity}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, lowCapacity: val }))
              }
            />

            <div className="border-t border-border" />

            <Toggle
              label="Lead Inquiry Alerts"
              description="Get notified when a potential member submits an inquiry"
              icon={BellRing}
              enabled={notifications.leadInquiry}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, leadInquiry: val }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Security                                                          */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Security</CardTitle>
              <CardDescription>
                Manage authentication and session security.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <Toggle
              label="Two-Factor Authentication"
              description="Require a verification code when logging in"
              icon={KeyRound}
              enabled={security.twoFactor}
              onChange={(val) =>
                setSecurity((prev) => ({ ...prev, twoFactor: val }))
              }
            />

            <div className="border-t border-border" />

            {/* Session Timeout */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Session Timeout
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
              </div>
              <select
                value={security.sessionTimeout}
                onChange={(e) =>
                  setSecurity((prev) => ({
                    ...prev,
                    sessionTimeout: e.target.value,
                  }))
                }
                className="rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
              </select>
            </div>

            <div className="border-t border-border" />

            {/* Audit Log Link */}
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-1 py-2 text-sm transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    View Audit Log
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Review all admin actions and system events
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Danger Zone                                                       */}
      {/* ----------------------------------------------------------------- */}
      <Card className="border-red-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions. Proceed with caution.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Export All Data
                </p>
                <p className="text-xs text-muted-foreground">
                  Download a complete backup of all gym data as JSON
                </p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>

            <div className="border-t border-border" />

            {/* Reset Demo Data */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-red-500">
                  Reset Demo Data
                </p>
                <p className="text-xs text-muted-foreground">
                  Reset all data to the original demo state. This cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Data
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
