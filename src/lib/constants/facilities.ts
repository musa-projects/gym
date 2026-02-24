export const FACILITY_ZONES = [
  {
    name: "Cardio Zone",
    description:
      "State-of-the-art cardio equipment with personal screens and entertainment. Over 40 machines including treadmills, bikes, ellipticals, and rowing machines.",
    equipment: ["Technogym Treadmills", "Concept2 Rowers", "Assault Bikes", "StairMasters", "Ellipticals"],
    icon: "Heart",
    size: "3,000 sq ft",
  },
  {
    name: "Free Weights",
    description:
      "Comprehensive free weight area with dumbbells up to 60kg, multiple squat racks, bench presses, and Olympic lifting platforms.",
    equipment: ["Rogue Squat Racks", "Eleiko Barbells", "Hex Dumbbells (2-60kg)", "Olympic Platforms", "Deadlift Platforms"],
    icon: "Dumbbell",
    size: "4,000 sq ft",
  },
  {
    name: "Functional Training",
    description:
      "Open space designed for functional and CrossFit-style workouts with rigs, sleds, and specialty equipment.",
    equipment: ["Pull-Up Rigs", "Battle Ropes", "Plyo Boxes", "Prowler Sleds", "TRX Stations", "Kettlebells"],
    icon: "Zap",
    size: "2,500 sq ft",
  },
  {
    name: "Group Fitness Studios",
    description:
      "Two dedicated studios for group classes including yoga, HIIT, dance, and boxing. Premium sound systems and sprung floors.",
    equipment: ["Mirror Walls", "Sound System", "Sprung Floors", "Boxing Bags", "Yoga Props"],
    icon: "Users",
    size: "2 studios, 1,500 sq ft each",
  },
  {
    name: "Boxing Ring & Bags",
    description:
      "Full-size boxing ring with heavy bags, speed bags, and double-end bags. Perfect for boxing and kickboxing training.",
    equipment: ["Boxing Ring", "Heavy Bags (20)", "Speed Bags", "Double-End Bags", "Focus Mitts"],
    icon: "Swords",
    size: "2,000 sq ft",
  },
  {
    name: "Recovery & Wellness",
    description:
      "Infrared sauna, cold plunge pool, foam rolling station, and stretch area for post-workout recovery.",
    equipment: ["Infrared Sauna", "Cold Plunge Pool", "Foam Rollers", "Massage Guns", "Stretch Mats"],
    icon: "Sparkles",
    size: "1,000 sq ft",
  },
] as const;

export const AMENITIES = [
  { name: "Locker Rooms", description: "Spacious locker rooms with digital locks and premium finishes" },
  { name: "Showers", description: "Private shower stalls with complimentary towels and toiletries" },
  { name: "Free Parking", description: "Dedicated parking lot with 100+ spots, free for all members" },
  { name: "Juice Bar", description: "Fresh smoothies, protein shakes, and healthy snacks post-workout" },
  { name: "Wi-Fi", description: "High-speed Wi-Fi throughout the facility" },
  { name: "Towel Service", description: "Fresh towels provided for all members, included in membership" },
  { name: "Pro Shop", description: "Gym apparel, supplements, and accessories available on-site" },
  { name: "Childcare", description: "Supervised play area for kids while you work out (ages 2-10)" },
] as const;
