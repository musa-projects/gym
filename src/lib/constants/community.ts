export const EVENTS = [
  {
    id: "1",
    title: "Spring Shred Challenge",
    type: "Challenge" as const,
    date: "March 1 - April 30, 2026",
    description:
      "8-week body transformation challenge with weekly check-ins, nutrition guidance, and prizes for the top 3 transformations.",
    prizes: ["$500 Cash Prize", "3 Months Free Membership", "Personal Training Package"],
    spotsLeft: 12,
    totalSpots: 50,
  },
  {
    id: "2",
    title: "Monthly Lifting Competition",
    type: "Competition" as const,
    date: "Last Saturday of every month",
    description:
      "Friendly lifting competition open to all levels. Events include deadlift, bench press, and squat. Age and weight categories available.",
    prizes: ["Medals", "Gym Merch", "Bragging Rights"],
    spotsLeft: 8,
    totalSpots: 30,
  },
  {
    id: "3",
    title: "Nutrition Masterclass",
    type: "Workshop" as const,
    date: "March 15, 2026",
    description:
      "Learn how to fuel your workouts, meal prep like a pro, and understand macros with our certified nutritionist. Includes a recipe booklet.",
    prizes: [],
    spotsLeft: 20,
    totalSpots: 40,
  },
  {
    id: "4",
    title: "5K Fun Run",
    type: "Social" as const,
    date: "April 5, 2026",
    description:
      "Community 5K run through the downtown area. All fitness levels welcome. Post-run brunch and socializing at the gym.",
    prizes: ["Finisher Medals", "Event T-Shirt"],
    spotsLeft: 45,
    totalSpots: 100,
  },
  {
    id: "5",
    title: "Boxing Showcase Night",
    type: "Competition" as const,
    date: "April 20, 2026",
    description:
      "Watch our members showcase their boxing skills in friendly exhibition bouts. Great atmosphere, food, and live music.",
    prizes: ["Trophies", "Free Month Membership"],
    spotsLeft: 6,
    totalSpots: 16,
  },
  {
    id: "6",
    title: "Yoga & Meditation Retreat",
    type: "Workshop" as const,
    date: "May 10, 2026",
    description:
      "Full-day yoga and meditation retreat led by Aisha Patel. Includes sessions on breathwork, restorative yoga, and mindful movement.",
    prizes: [],
    spotsLeft: 15,
    totalSpots: 25,
  },
] as const;

export const COMMUNITY_HIGHLIGHTS = [
  { label: "Events This Month", value: "8" },
  { label: "Challenge Participants", value: "200+" },
  { label: "Community Posts", value: "1,500+" },
  { label: "Friendships Made", value: "Countless" },
] as const;
