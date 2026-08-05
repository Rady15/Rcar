import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "/?view=browse", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "/?view=deals", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "/?view=login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
