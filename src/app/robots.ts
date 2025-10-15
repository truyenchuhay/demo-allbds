import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const runtime = 'edge';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers()
    const host = await headersList.get("host")?.replace(":3000", "") || ""
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `https://${host}/sitemap.xml`,
    }
}