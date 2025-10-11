import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Khởi tạo R2 client
const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_R2!,
        secretAccessKey: process.env.SECRET_KEY_R2!,
    },
});

export const dynamic = "force-dynamic"; // Next.js 14 App Router

export async function GET() {
    const key = "diaocdautu.com.vn/favicon.ico"; // key trong R2

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_STATIC!,
            Key: key,
        });

        const response: any = await r2Client.send(command);

        // Nếu không có file → trả 404
        if (!response.Body) {
            return new NextResponse(null, { status: 404 });
        }

        // Chuyển Body sang ArrayBuffer
        let arrayBuffer: ArrayBuffer;
        if ("transformToArrayBuffer" in response.Body) {
            arrayBuffer = await response.Body.transformToArrayBuffer();
        } else {
            // Fallback Node.js / Worker
            arrayBuffer = await new Response(response.Body as any).arrayBuffer();
        }

        // Lấy Content-Type từ metadata nếu có, fallback là image/x-icon
        const contentType = response.ContentType || "image/x-icon";

        const headers = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "public, immutable, max-age=2592000",
            "Content-Length": arrayBuffer.byteLength.toString(),
        });

        return new NextResponse(arrayBuffer, { status: 200, headers });
    } catch (err) {
        // Lỗi bất kỳ → trả 404
        return new NextResponse(null, { status: 404 });
    }
}
