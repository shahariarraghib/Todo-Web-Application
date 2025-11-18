import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";
  const staticRoute = [
    {
      url: baseUrl,
      lastModified: new Date("2025-11-15"),
      changeFrequency: "yearly" as const,
      priority: 1,
    }
  ];

  return [...staticRoute];
}
