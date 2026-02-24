export const MEMBERSHIP_PLANS = [
  {
    name: "Basic",
    monthlyPrice: 2900,
    yearlyPrice: 27900,
    description: "Perfect for getting started on your fitness journey",
    features: [
      "Access during off-peak hours (6AM-4PM)",
      "Full gym floor access",
      "Locker room & showers",
      "2 group classes per week",
      "Basic fitness assessment",
    ],
    notIncluded: [
      "Personal training sessions",
      "Sauna & recovery zone",
      "Guest passes",
      "Nutrition consultation",
      "Priority class booking",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    monthlyPrice: 5900,
    yearlyPrice: 56900,
    description: "Our most popular plan for serious fitness enthusiasts",
    features: [
      "Unlimited 24/7 access",
      "All group classes included",
      "1 personal training session/month",
      "Sauna & recovery zone",
      "Nutrition consultation",
      "Guest pass (1/month)",
      "Priority class booking",
    ],
    notIncluded: [
      "4 PT sessions/month",
      "Custom meal plan",
      "Private locker",
      "Unlimited guest passes",
    ],
    highlighted: true,
  },
  {
    name: "VIP",
    monthlyPrice: 9900,
    yearlyPrice: 94900,
    description: "The ultimate fitness experience with premium perks",
    features: [
      "Everything in Premium",
      "4 personal training sessions/month",
      "Custom meal plan",
      "Recovery & massage credits",
      "Private locker",
      "Unlimited guest passes",
      "Priority everything",
      "Merchandise discounts (15%)",
    ],
    notIncluded: [],
    highlighted: false,
  },
] as const;

export const MEMBERSHIP_COMPARISON = [
  { feature: "Gym Access", basic: "Off-peak", premium: "24/7", vip: "24/7" },
  { feature: "Group Classes", basic: "2/week", premium: "Unlimited", vip: "Unlimited" },
  { feature: "Personal Training", basic: false, premium: "1/month", vip: "4/month" },
  { feature: "Sauna & Recovery", basic: false, premium: true, vip: true },
  { feature: "Nutrition Consult", basic: false, premium: true, vip: true },
  { feature: "Custom Meal Plan", basic: false, premium: false, vip: true },
  { feature: "Guest Passes", basic: false, premium: "1/month", vip: "Unlimited" },
  { feature: "Private Locker", basic: false, premium: false, vip: true },
  { feature: "Priority Booking", basic: false, premium: true, vip: true },
  { feature: "Massage Credits", basic: false, premium: false, vip: true },
  { feature: "Merch Discount", basic: false, premium: false, vip: "15%" },
] as const;

export const MEMBERSHIP_FAQ = [
  {
    question: "Can I freeze my membership?",
    answer:
      "Yes, all plans can be frozen for up to 30 days per year at no additional cost. Premium and VIP members can freeze for up to 60 days.",
  },
  {
    question: "Is there a student discount?",
    answer:
      "Absolutely! Students with a valid student ID get 20% off any plan. Just show your ID at signup or upload it during online registration.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, there are no long-term contracts. Monthly plans can be cancelled with 30 days notice. Yearly plans are non-refundable but fully transferable.",
  },
  {
    question: "What happens after my free trial?",
    answer:
      "After your free trial session, there is no obligation. A trainer will help you find the right plan if you decide to join. No pressure, just results.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can switch plans at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "Do you offer corporate plans?",
    answer:
      "Yes! We offer special corporate rates for companies with 5+ employees. Contact us for a custom quote tailored to your team's needs.",
  },
] as const;
