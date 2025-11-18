import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoute = [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date("2025-11-15"),
      changeFrequency: "yearly" as const,
      priority: 1,
    }
  ];

  return [...staticRoute];
}
