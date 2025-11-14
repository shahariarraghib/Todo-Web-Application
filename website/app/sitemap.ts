import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoute = [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date("2025-08-15"),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms-and-conditions`,
      lastModified: new Date("2025-08-15"),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy`,
      lastModified: new Date("2025-08-15"),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
  ];

  return [...staticRoute];
}
