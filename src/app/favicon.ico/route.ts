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

export async function GET() {
    const key = "diaocdautu.com.vn/favicon.ico"; // path file trong R2

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_STATIC!,
            Key: key,
        });

        const response: any = await r2Client.send(command);

        // Nếu không có file → trả 404 ngay
        if (!response.Body) {
            return new NextResponse(null, { status: 404 });
        }

        // Chuyển Body sang ArrayBuffer
        const arrayBuffer =
            "transformToArrayBuffer" in response.Body
                ? await response.Body.transformToArrayBuffer()
                : await new Response(response.Body as any).arrayBuffer();

        const headers = new Headers({
            "Content-Type": "image/x-icon",
            "Cache-Control": "public, immutable, max-age=2592000",
            "Content-Length": arrayBuffer.byteLength.toString(),
        });

        return new NextResponse(arrayBuffer, { status: 200, headers });
    } catch (err) {
        // Lỗi cũng trả 404 luôn
        return new NextResponse(null, { status: 404 });
    }
}
