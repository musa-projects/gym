export const CONTACT_INFO = {
  address: "123 Fitness Avenue, Downtown District",
  city: "New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@bigvisiongym.com",
  whatsapp: "+15551234567",
  hours: {
    weekdays: "5:00 AM - 11:00 PM",
    saturday: "6:00 AM - 10:00 PM",
    sunday: "7:00 AM - 8:00 PM",
  },
} as const;

export const FITNESS_GOALS = [
  "Lose Weight",
  "Build Muscle",
  "General Fitness",
  "Improve Flexibility",
  "Rehabilitation",
  "Sports Performance",
] as const;

export const PREFERRED_TIMES = [
  "Early Morning (5-8 AM)",
  "Morning (8-11 AM)",
  "Afternoon (12-4 PM)",
  "Evening (5-8 PM)",
  "Late Evening (8-11 PM)",
] as const;
