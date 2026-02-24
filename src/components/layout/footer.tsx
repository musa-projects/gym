"use client";

import Link from "next/link";
import {
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants/navigation";
import { CONTACT_INFO } from "@/lib/constants/contact";
import { cn } from "@/lib/utils";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Memberships", href: "/memberships" },
    { label: "Classes", href: "/classes" },
    { label: "Trainers", href: "/trainers" },
    { label: "Shop", href: "/shop" },
  ],
  Company: [
    { label: "Transformations", href: "/transformations" },
    { label: "Facilities", href: "/facilities" },
    { label: "Community", href: "/community" },
    { label: "Nutrition", href: "/nutrition" },
  ],
  Support: [
    { label: "Contact", href: "/contact" },
    { label: "Free Trial", href: "/free-trial" },
    { label: "Corporate", href: "/corporate" },
    { label: "Referral", href: "/referral" },
  ],
};

const socialIcons = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a]">
      {/* Gradient divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Subtle radial glow at top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.03)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="font-[var(--font-oswald)] text-2xl font-bold uppercase tracking-wider text-foreground">
                Big<span className="text-primary">Vision</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Transform your body, elevate your mind. Big Vision Gym is more
              than a gym &mdash; it&apos;s a movement. Join thousands who chose
              to be stronger every day.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>{CONTACT_INFO.email}</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "glass flex h-10 w-10 items-center justify-center rounded-lg",
                    "text-muted-foreground transition-all duration-300",
                    "hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-[var(--font-oswald)] text-sm font-bold uppercase tracking-widest text-foreground">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative text-sm text-muted-foreground transition-colors hover:text-primary",
                        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#262626] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Big Vision Gym. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Open Now &middot; {CONTACT_INFO.hours.weekdays}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
