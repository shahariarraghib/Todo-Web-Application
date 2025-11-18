import { Metadata } from "next";

type SeoContent = {
    title: string;
    description: string;
    image: string;
    siteUrl?: string;
    keywords?: string | string[];
    tags?: string;
};

export function generateMetadata(seoContent: SeoContent): Metadata {
    const { title, description, image, siteUrl, keywords, tags } = seoContent;
    const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "";
    const keywordsValue = keywords 
        ? (Array.isArray(keywords) ? keywords.join(", ") : keywords)
        : tags;

    const metadata: Metadata = {
        title: title,
        description: description,
        keywords: keywordsValue,
        openGraph: {
            title: title,
            description: description,
            images: baseUrl ? [{ url: new URL(image, baseUrl).href }] : [{ url: image }],
            url: siteUrl,
            type: "website"
        },
        twitter: {
            title: title,
            description: description,
            images: baseUrl ? [{ url: new URL(image, baseUrl).href }] : [{ url: image }],
            card: "summary_large_image"
        },
        robots: "index, follow",
        creator: "biota",
        publisher: "biota"
    };

    return metadata;
}
