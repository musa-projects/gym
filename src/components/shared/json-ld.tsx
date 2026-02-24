export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function GymJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GymOrSportsActivityLocation",
    name: "Big Vision Gym",
    description:
      "Premium fitness facility with expert trainers, diverse classes, and a powerful community.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bigvisiongym.com",
    telephone: "+1-555-123-4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Fitness Boulevard",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      postalCode: "90001",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "05:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "06:00",
        closes: "22:00",
      },
    ],
    priceRange: "$$",
    image: "/og-image.png",
    sameAs: [
      "https://instagram.com/bigvisiongym",
      "https://facebook.com/bigvisiongym",
      "https://twitter.com/bigvisiongym",
      "https://youtube.com/bigvisiongym",
    ],
  };

  return <JsonLd data={data} />;
}
