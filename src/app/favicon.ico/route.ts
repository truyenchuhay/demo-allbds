import { headers } from 'next/headers'
import { NextResponse } from "next/server";

export async function GET() {
    const headersList = await headers()
    const host = await headersList.get("host")?.replace(":3000", "") || ""

    const fileUrl = `${process.env.URL_FILE_STATIC}/diaocdautu.com.vn/favicon.ico`;

    try {
        const res = await fetch(fileUrl);

        if (!res.ok) {
            return new NextResponse("File not found", { status: 404 });
        }

        // Lấy ArrayBuffer của file
        const arrayBuffer = await res.arrayBuffer();

        // Lấy header từ response gốc
        const contentType = res.headers.get("content-type") || "application/octet-stream";
        const contentLength = res.headers.get("content-length") || arrayBuffer.byteLength.toString();
        const lastModified = res.headers.get("last-modified") || "";
        const etag = res.headers.get("etag") || "";

        // Trả về response với header gốc
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": contentLength,
                "Last-Modified": lastModified,
                "ETag": etag,
                "Cache-Control": "public, immutable, max-age=2592000",
            },
        });
    } catch (err) {
        return new NextResponse(null, { status: 404 });
    }
}
