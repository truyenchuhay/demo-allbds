import { NextResponse, type NextRequest } from 'next/server'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_R2!,
        secretAccessKey: process.env.SECRET_KEY_R2!,
    },
});

export const dynamic = "force-dynamic"; // Next.js 14 App Router

export async function GET(_req: NextRequest, ctx: RouteContext<'/data/content-projects/[slug]'>) {
    const { slug } = await ctx.params

    const key = `diaocdautu.com.vn/data/content-projects/${slug}`

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_STATIC!,
            Key: key,
        });

        const response: any = await r2Client.send(command);

        if (!response.Body) {
            return new NextResponse(null, { status: 404 });
        }

        // Chuyển Body sang ArrayBuffer
        const arrayBuffer =
            "transformToArrayBuffer" in response.Body
                ? await response.Body.transformToArrayBuffer()
                : await new Response(response.Body as any).arrayBuffer();

        // Lấy metadata từ R2
        const headers = new Headers({
            "Content-Type": response.ContentType || "application/octet-stream",
            "Content-Length": response.ContentLength?.toString() || arrayBuffer.byteLength.toString(),
            "Last-Modified": response.LastModified?.toUTCString() || "",
            "ETag": response.ETag || "",
            "Cache-Control": response.CacheControl || "public, immutable, max-age=2592000",
        });

        return new NextResponse(arrayBuffer, { status: 200, headers });
    } catch (err) {
        console.error(err);
        return new NextResponse(null, { status: 404 });
    }
}   