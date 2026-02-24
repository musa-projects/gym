"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/leads";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    const result = await submitContactForm(data);
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        label="Contact"
        title="Get In Touch"
        description="We'd love to hear from you. Drop by, call, or send us a message."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">Visit Us</h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: MapPin, label: "Address", value: `${CONTACT_INFO.address}\n${CONTACT_INFO.city}` },
                  { icon: Phone, label: "Phone", value: CONTACT_INFO.phone },
                  { icon: Mail, label: "Email", value: CONTACT_INFO.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{label}</p>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="mt-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Hours</p>
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <p>Mon-Fri: {CONTACT_INFO.hours.weekdays}</p>
                      <p>Saturday: {CONTACT_INFO.hours.saturday}</p>
                      <p>Sunday: {CONTACT_INFO.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4 transition-colors hover:bg-green-500/10"
              >
                <MessageCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-green-500">Chat on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Usually replies within an hour</p>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="mt-8 h-64 overflow-hidden rounded-2xl border border-border bg-accent">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-primary/40" />
                    <p className="mt-2 text-sm">Map will be embedded here</p>
                    <p className="text-xs text-muted-foreground">(Google Maps integration coming soon)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <CheckCircle className="mx-auto h-16 w-16 text-primary" />
                      <h3 className="mt-4 text-2xl font-bold text-foreground">Message Sent!</h3>
                      <p className="mt-2 text-muted-foreground">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="mb-6 text-2xl font-bold text-foreground">Send a Message</h2>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Full Name *
                          </label>
                          <input
                            {...register("name")}
                            className={cn(
                              "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                              errors.name ? "border-destructive" : "border-border"
                            )}
                            placeholder="John Doe"
                          />
                          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Email *
                          </label>
                          <input
                            {...register("email")}
                            type="email"
                            className={cn(
                              "w-full rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                              errors.email ? "border-destructive" : "border-border"
                            )}
                            placeholder="john@example.com"
                          />
                          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Phone (Optional)
                          </label>
                          <input
                            {...register("phone")}
                            type="tel"
                            className="w-full rounded-lg border border-border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Message *
                          </label>
                          <textarea
                            {...register("message")}
                            rows={5}
                            className={cn(
                              "w-full resize-none rounded-lg border bg-accent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                              errors.message ? "border-destructive" : "border-border"
                            )}
                            placeholder="How can we help you?"
                          />
                          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          <Send className="mr-2 h-4 w-4" />
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
