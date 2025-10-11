import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_R2!,
        secretAccessKey: process.env.SECRET_KEY_R2!,
    },
});

export async function GET(req: Request) {
    const key = "diaocdautu.com.vn/favicon.ico";

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

        // Lấy metadata từ response
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
