import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bigvisiongym.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/memberships",
    "/classes",
    "/trainers",
    "/transformations",
    "/facilities",
    "/community",
    "/nutrition",
    "/nutrition/calculator",
    "/contact",
    "/free-trial",
    "/shop",
    "/corporate",
    "/referral",
    "/login",
    "/signup",
  ];

  const classRoutes = [
    "/classes/hiit",
    "/classes/strength",
    "/classes/crossfit",
    "/classes/yoga",
    "/classes/boxing",
    "/classes/spinning",
  ];

  const trainerRoutes = [
    "/trainers/1",
    "/trainers/2",
    "/trainers/3",
    "/trainers/4",
    "/trainers/5",
    "/trainers/6",
  ];

  const productRoutes = [
    "/shop/performance-tshirt-black",
    "/shop/training-shorts",
    "/shop/gym-hoodie",
    "/shop/compression-leggings",
    "/shop/whey-protein-chocolate",
    "/shop/pre-workout-formula",
    "/shop/bcaa-recovery-mix",
    "/shop/creatine-monohydrate",
    "/shop/gym-bag-pro",
    "/shop/shaker-bottle",
    "/shop/resistance-bands-set",
    "/shop/lifting-gloves",
  ];

  const routes: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...classRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...trainerRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...productRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return routes;
}
